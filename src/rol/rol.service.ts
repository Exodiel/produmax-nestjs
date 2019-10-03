import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { RolDTO } from './rol.dto';

@Injectable()
export class RolService {
    constructor(@InjectRepository(Rol) private readonly rolRepository: Repository<Rol>) {}

    async getRols(): Promise<Rol[]> {
        const rols = await this.rolRepository.find();
        return rols;
    }

    async getRol(rolId: number): Promise<Rol> {
        const rol = await this.rolRepository.findOneOrFail(rolId);
        return rol;
    }

    async createRol(rolDTO: RolDTO): Promise<Rol> {
        const rol = this.rolRepository.create(rolDTO);
        await this.rolRepository.save(rol);
        return rol;
    }

    async deleteRol(rolId: number): Promise<any> {
        const rol = await this.rolRepository.findOne({ where: { id: rolId } });
        if (!rol) {
            throw new NotFoundException('No se encontró el rol');
        }
        await this.rolRepository.delete(rolId);
        return rol;
    }

    async updateRol(rolId: number, rolDTO: RolDTO): Promise<Rol> {
        let rol = await this.rolRepository.findOneOrFail({ where: { id: rolId } });
        if (!rol) {
            throw new HttpException('No se encontró la unidad', HttpStatus.NOT_FOUND);
        }
        await this.rolRepository.update({id: rolId}, rolDTO);
        rol = await this.rolRepository.findOneOrFail({ id: rolId });
        return rol;
    }
}
