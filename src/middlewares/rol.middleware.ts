import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { RequestCustom } from '../custom/RequestCustom';

@Injectable()
export class RolMiddleware implements NestMiddleware {
    async use(expressRequest: Request, res: Response, next: NextFunction) {
        const req = expressRequest as RequestCustom;
        const { rol } = req.jwtPayload;
        try {
            const rolModel = await getRepository(Rol)
                .createQueryBuilder('rols')
                .where('rols.name = :name', { name: 'admin' })
                .getOne();
            if (!rolModel) {
                throw new NotFoundException('No se encontró el rol');
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
