import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from '../rol/rol.entity';

@Injectable()
export class RolMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const {id, rol} = res.locals.jwtPayload;
        try {
            const rolModel = await getRepository(Rol)
                .createQueryBuilder('rols')
                .leftJoinAndSelect('rols.user', 'user', 'user.id = :id', { id })
                .where('rols.name = :name', { name: 'admin' })
                .getOne();
            if (!rolModel) {
                throw new NotFoundException('No se encontró el usuario');
            }

            if (rolModel.name === rol) {
                next();
            } else {
                throw new UnauthorizedException('No se encuentra autorizado');
            }

        } catch (error) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
    }
}
