import { UserR } from '../user/user.dto';
import { UserRO } from '../user/user.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository, getRepository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { AppGateway } from '../app.gateway';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
        private gateway: AppGateway,
    ) {}

    async getCountUsers() {
        const count = await getRepository(User)
            .createQueryBuilder('user')
            .select('COUNT(*) as count')
            .groupBy('user.id')
            .getRawOne();

        return count;
    }

    async login(userRO: UserRO) {
        const { email, password } = userRO;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Usuario no es correcto',
                HttpStatus.BAD_REQUEST,
            );
        }
        const rol = await getRepository(Rol)
            .createQueryBuilder('rol')
            .select('rol.name')
            .leftJoinAndSelect(User, 'user', 'user.rolId = rol.id')
            .where('user.email = :email', { email })
            .getOne();
        if (!rol) {
            throw new HttpException(
                'Rol no encontrado',
                HttpStatus.NOT_FOUND,
            );
        }
        const payload = { email: user.email, id: user.id, rol: rol.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userR: UserR) {
        const rol = await this.rolRepository.findOne({ where: { name: 'client' } });
        if (!rol) {
            throw new HttpException('No se encontró el rol', HttpStatus.BAD_REQUEST);
        }
        const { ci, name, lastname, age, email, password, phone } = userR;
        let user = await getRepository(User)
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.name',
                'user.lastname',
                'user.age',
                'user.email',
                'user.phone',
            ])
            .where('user.email = : email', { email })
            .getOne();
        if (user) {
            throw new HttpException('Ya existe el usuario', HttpStatus.BAD_REQUEST);
        }
        user = this.userRepository.create({ ci, name, lastname, age, email, password, phone, rol });
        await this.userRepository.save(user);
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        const payload = { email: user.email, id: user.id, rol: rol.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
