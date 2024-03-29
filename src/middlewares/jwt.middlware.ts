import { Injectable, NestMiddleware, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestCustom } from '../custom/RequestCustom';
@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(expressRequest: Request, res: Response, next: NextFunction) {
        const req = expressRequest as RequestCustom;
        if (!req.headers.authorization) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
        const auth = req.headers.authorization;
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        try {

            req.jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

        } catch (error) {
            throw new UnauthorizedException('No se encuentra autorizado');
        }
        next();
    }
}
