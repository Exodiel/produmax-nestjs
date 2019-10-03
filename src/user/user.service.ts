import { UserDTO, UserUp } from './user.dto';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, getRepository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { AppGateway } from '../app.gateway';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
        private gateway: AppGateway,
    ) {}

    async getUsers(): Promise<User[]> {
        const users = await getRepository(User)
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.ci',
                'user.name',
                'user.lastname',
                'user.age',
                'user.email',
                'user.phone',
            ])
            .getMany();
        return users;
    }

    async getUser(userId: number): Promise<User> {
        const user = await getRepository(User)
        .createQueryBuilder('user')
        .select([
            'user.id',
            'user.ci',
            'user.name',
            'user.lastname',
            'user.age',
            'user.email',
            'user.phone',
        ])
        .where('user.id = :id', { id: userId })
        .getOne();
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async getUserCI(userCi: string): Promise<User> {
        const user = await getRepository(User)
        .createQueryBuilder('user')
        .select([
            'user.id',
            'user.ci',
            'user.name',
            'user.lastname',
            'user.age',
            'user.email',
            'user.phone',
        ])
        .where('user.ci = :ci', { ci: userCi })
        .getOne();
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async createUser(userDTO: UserDTO): Promise<User> {
        const {ci, name, lastname, age, email, password, phone, rolId } = userDTO;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
        }
        const rol = await this.rolRepository.findOneOrFail({ id: rolId });
        if (!rol) {
            throw new HttpException('No se encontró el rol', HttpStatus.NOT_FOUND);
        }
        user = this.userRepository.create({ ci, name, lastname, age, email, password, phone, rol });
        await this.userRepository.save(user);
        const lastUser = await this.getLastUser();
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return lastUser;
    }

    async getLastUser() {
        const user = await getRepository(User)
            .createQueryBuilder('user')
            .orderBy('user.id', 'DESC')
            .limit(1)
            .getOne();
        return user;
    }

    async getCountUsers() {
        const count = await getRepository(User)
            .createQueryBuilder('user')
            .select('COUNT(*) as count')
            .groupBy('user.id')
            .getRawOne();

        return count;
    }

    async deleteUser(userId: number): Promise<any> {
        const user = await this.userRepository.findOneOrFail({ id: userId });
        if (!user) {
            throw new HttpException('El usuario no se encontró', HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.delete(userId);
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return user;
    }

    async updateUser(userId: number, userUp: UserUp): Promise<User> {
        const {ci, name, lastname, age, email, phone} = userUp;
        let user = await this.userRepository.findOneOrFail({where: { id: userId }});
        if (!user) {
            throw new HttpException('No se encontró el usuario', HttpStatus.NOT_FOUND);
        }
        await getRepository(User)
            .createQueryBuilder('user')
            .update(User)
            .set({ ci, name, lastname, age, email, phone })
            .where('user.id = :id', { id: userId })
            .execute();
        user = await this.userRepository.findOne({ where: { id: userId } });
        return user;
    }
}
