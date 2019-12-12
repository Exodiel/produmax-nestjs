import { UserR } from '../user/user.dto';
import { UserRO } from '../user/user.dto';
import { AuthService } from './auth.service';
import { Controller, Post, Body, Res, HttpStatus, Get, Req, UseGuards, Query, Delete } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Res() res: Response, @Body() body: UserRO) {
        const token = await this.authService.login(body);
        return res.status(HttpStatus.OK).json(token);
    }

    @Post('/register')
    async register(@Res() res: Response, @Body() userR: UserR) {
        const user = await this.authService.register(userR);
        return res.status(HttpStatus.OK).json(user);
    }

    @Delete('/logout')
    async logout(@Res() res: Response, @Req() req: Request, @Query('sessionId') sessionId: string) {
        await this.authService.destroySession(sessionId);
        return res.status(HttpStatus.ACCEPTED).json({ message: 'Cerraste sesión' });
    }
}
