import { UserR } from '../user/user.dto';
import { UserRO } from '../user/user.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../rol/rol.entity';
import { AppGateway } from '../app.gateway';
import { Session } from '../session/session.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        private gateway: AppGateway,
        private dataSource: DataSource
    ) {}

    async getCountUsers() {
        const count = await this.dataSource.getRepository(User)
            .createQueryBuilder('user')
            .select('COUNT(*) as count')
            .groupBy('user.id')
            .getRawOne();

        return count;
    }

    async login(userRO: UserRO) {
        const { email, password } = userRO;
        const user = await this.dataSource.getRepository(User)
            .createQueryBuilder('user')
            .addSelect('user.password')
            .leftJoinAndSelect('user.rol', 'rol')
            .where('user.email = :email', {email})
            .getOne();
        if (!user) {
            throw new HttpException(
                'Correo incorrecto',
                HttpStatus.BAD_REQUEST,
            );
        }
        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            throw new HttpException(
                'Contraseña incorrecta',
                HttpStatus.BAD_REQUEST,
            );
        }
        const rol = await this.searchUserRolType(email);
        const type = this.typeUser(rol.name) ;
        const payload = { email: user.email, id: user.id, rol: rol.name };
        const payloadString = JSON.stringify(payload);
        const token = this.jwtService.sign(payload);
        const lastActivity = new Date().toString().substring(0, 24);
        // tslint:disable-next-line:max-line-length
        const session = this.sessionRepository.create({ payload: payloadString, token, expiresAt: +process.env.EXPIRES_IN, user, lastActivity });
        await this.sessionRepository.save(session);
        return {
            access_token: token,
            type,
            expires_in: +process.env.EXPIRES_IN,
            sessionId: session.sessionId,
            user,
        };
    }

    private async searchUserRolType(email: string): Promise<Rol> {
        const rol = await this.dataSource.getRepository(Rol)
            .createQueryBuilder('rol')
            .select('rol.name')
            .leftJoinAndSelect(User, 'user', 'user.rolId = rol.id')
            .where('user.email = :email', { email })
            .getOne();
        if (!rol) {
            throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
        }

        return rol;
    }

    private typeUser(type: string): number {
        let t: number;
        switch (type) {
            case 'admin':
                t = 1;
                break;
            case 'client':
                t = 2;
                break;
            case 'store':
                t = 3;
                break;
            default:
                t = 0;
                break;
        }
        return t;
    }

    async register(userR: UserR) {
        const rol = await this.rolRepository.findOne({ where: { name: 'client' } });
        if (!rol) {
            throw new HttpException('No se encontró el rol', HttpStatus.BAD_REQUEST);
        }
        const { ci, name, lastname, birthdate, email, password, phone } = userR;
        await this.searchUserByEmail(email);
        const user = this.userRepository.create({ ci, name, lastname, birthdate, email, password, phone, rol });
        await this.userRepository.save(user);
        const counter = await this.getCountUsers();
        const type = this.typeUser(rol.name) ;
        this.gateway.wss.emit('countUsers', counter);
        const payload = { email: user.email, id: user.id, rol: rol.name };
        const payloadString = JSON.stringify(payload);
        const token = this.jwtService.sign(payload);
        const lastActivity = new Date().toString().substring(0, 24);
        const session = this.sessionRepository.create({ payload: payloadString, token, expiresAt: +process.env.EXPIRES_IN, user, lastActivity});
        await this.sessionRepository.save(session);
        return {
            access_token: token,
            type,
            expires_in: +process.env.EXPIRES_IN,
            sessionId: session.sessionId,
            user,
        };
    }

    async destroySession(sessionId: string) {
        const session = await this.sessionRepository.findOneBy({ sessionId });
        if (!session) {
            throw new NotFoundException('No existe sesión');
        }
        await this.sessionRepository.remove(session);
    }

    private async searchUserByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
            throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
        }

        return false;
    }
}
