import { Injectable, NestMiddleware, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtConstant } from '../auth/constant';
import * as jwt from 'jsonwebtoken';
import { RequestCustom } from '../custom/RequestCustom';
@Injectable()
export class JwtMiddleware implements NestMiddleware {
    async use(expressRequest: Request, res: Response, next: NextFunction) {
        const req = expressRequest as RequestCustom;
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
            req.jwtPayload = jwtPayload;
        } catch (error) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
        next();
    }
}
