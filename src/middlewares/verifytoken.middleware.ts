import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstant } from '../auth/constant';

export async function VerifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
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
