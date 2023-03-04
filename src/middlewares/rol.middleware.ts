import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { RequestCustom } from '../custom/RequestCustom';

@Injectable()
export class RolMiddleware implements NestMiddleware {
    constructor(private dataSource: DataSource) {}
    async use(expressRequest: Request, res: Response, next: NextFunction) {
        const req = expressRequest as RequestCustom;
        const { rol } = req.jwtPayload;
        try {
            const rolModel = await this.dataSource.getRepository(Rol)
                .createQueryBuilder('rols')
                .where('rols.name = :name', { name: 'admin' })
                .getOne();
            if (!rolModel) {
                throw new NotFoundException('No se encontró el rol');
            }

            if (rolModel.name !== rol) {
                throw new UnauthorizedException('No se encuentra autorizado');
            }

            next();

        } catch (error) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
    }
}
