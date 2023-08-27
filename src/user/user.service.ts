import { Order } from '../order/order.entity';
import { UserDTO } from './user.dto';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Repository, DataSource } from 'typeorm';
import { AppGateway } from '../app.gateway';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private gateway: AppGateway,
        private dataSource: DataSource,
    ) { }

    async getUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async getUserCI(userCi: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { identification: userCi } });
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async getOrdersRelationated(userId: string) {
        const orders = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .innerJoin('order.user', 'user', 'user.id = :id', { id: userId })
            .getMany();
        return orders;
    }

    async createUser(userDTO: UserDTO): Promise<User> {
        const { identification, identificationType, name, lastname, birthdate, email, password, phone, imageUrl } = userDTO;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
        }
        user = this.userRepository.create({ identification, name, lastname, birthdate, email, password, phone, identificationType, imageUrl });
        const newUser = await this.userRepository.save(user);
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return newUser;
    }

    async getCountUsers() {
        const count = await this.dataSource.getRepository(User)
            .createQueryBuilder('user')
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }

    async deleteUser(userId: string): Promise<any> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new HttpException('El usuario no se encontró', HttpStatus.BAD_REQUEST);
        }
        await deletePhoto(user.imageUrl);
        await this.userRepository.delete(userId);
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return user;
    }

    async updateUser(userId: string, userDTO: UserDTO): Promise<User> {
        const { identification, identificationType, name, lastname, birthdate, email, phone, imageUrl } = userDTO;
        let user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('No se encontró el usuario', HttpStatus.NOT_FOUND);
        }
        if (user.imageUrl !== imageUrl) {
            await deletePhoto(user.imageUrl);
        }
        await this.dataSource.getRepository(User)
            .createQueryBuilder('user')
            .update(User)
            .set({ identification, identificationType, name, lastname, birthdate, email, phone, imageUrl })
            .where('user.id = :id', { id: userId })
            .execute();
        user = await this.userRepository.findOne({ where: { id: userId } });

        return user;
    }

    async updatePassword(password: string, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new HttpException('No se encontró el usuario', HttpStatus.NOT_FOUND);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userRepository.update(user.id, { password: hashedPassword });
        return 'Contraseña actualizada';
    }
}
