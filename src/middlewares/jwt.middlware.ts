import { Injectable, NestMiddleware, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtConstant } from '../auth/constant';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
        const auth = req.headers.authorization;
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        let jwtPayload: any;
        try {
            jwtPayload = await jwt.verify(token, jwtConstant.secret);
            res.locals.jwtPayload = jwtPayload;
        } catch (error) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
        next();
    }
}
