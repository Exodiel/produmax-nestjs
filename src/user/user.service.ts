import { Order } from '../order/order.entity';
import { UserDTO } from './user.dto';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Repository, getRepository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { AppGateway } from '../app.gateway';
import { Image } from '../image/image.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private gateway: AppGateway,
    ) {}

    async getUsers(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['rol', 'image'] });
        return users;
    }

    async getUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['rol', 'image'] });
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async getUserCI(userCi: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { ci: userCi }, relations: ['rol', 'image'] });
        if (!user) {
            throw new NotFoundException('No se encontró el usuario');
        }
        return user;
    }

    async getOrdersRelationated(userId: number) {
        const orders = await getRepository(Order)
            .createQueryBuilder('order')
            .innerJoin('order.user', 'user', 'user.id = :id', { id: userId })
            .getMany();
        return orders;
    }

    async createUser(userDTO: UserDTO): Promise<User> {
        const {ci, name, lastname, birthdate, email, password, phone, rolId, imageId } = userDTO;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
        }
        const rol = await this.searchRol(rolId);
        const image = await this.searchImage(imageId);
        user = this.userRepository.create({ ci, name, lastname, birthdate, email, password, phone, rol, image });
        await this.userRepository.save(user);
        const lastUser = await this.getLastUser();
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return lastUser;
    }

    private async searchImage(imageId: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException('No se encontró la imagen');
        }

        return image;
    }

    private async searchRol(rolId: number): Promise<Rol> {
        const rol = await this.rolRepository.findOne({ id: rolId });
        if (!rol) {
            throw new HttpException('No se encontró el rol', HttpStatus.NOT_FOUND);
        }
        return rol;
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
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }

    async deleteUser(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({ id: userId });
        if (!user) {
            throw new HttpException('El usuario no se encontró', HttpStatus.BAD_REQUEST);
        }
        await deletePhoto(user.image.filepath);
        await this.userRepository.delete(userId);
        const counter = await this.getCountUsers();
        this.gateway.wss.emit('countUsers', counter);
        return user;
    }

    async updateUser(userId: number, userDTO: UserDTO): Promise<User> {
        const {ci, name, lastname, birthdate, email, phone, rolId, imageId } = userDTO;
        let user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new HttpException('No se encontró el usuario', HttpStatus.NOT_FOUND);
        }
        const rol = await this.searchRol(rolId);
        const image = await this.searchImage(imageId);
        const imageUser = await this.imageRepository.findOneOrFail(user.image.id);
        if (user.image.filepath !== image.filepath) {
            await this.imageRepository.remove(imageUser);
            await deletePhoto(user.image.filepath);
        }
        await getRepository(User)
            .createQueryBuilder('user')
            .update(User)
            .set({ ci, name, lastname, birthdate, email, phone, rol, image })
            .where('user.id = :id', { id: userId })
            .execute();
        user = await this.userRepository.findOne({ where: { id: userId } });
        return user;
    }

    async updatePassword(password: string, userId: number) {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new HttpException('No se encontró el usuario', HttpStatus.NOT_FOUND);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userRepository.update(user.id, { password: hashedPassword });
        return 'Contraseña actualizada';
    }
}
