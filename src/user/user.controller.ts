import { Controller, Get, Res, HttpStatus, Param, Put, Body, Delete, Post, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { UserDTO, UserUp } from './user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    async getUsers(@Res() res: Response) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/:id')
    async getUser(@Res() res: Response, @Param('id') id: number) {
        const user = await this.userService.getUser(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('/:ci')
    async getUserCi(@Res() res: Response, @Param('ci') ci: string) {
        const user = await this.userService.getUserCI(ci);
        return res.status(HttpStatus.OK).json(user);
    }

    @Put('/:id')
    async updateUser(@Res() res: Response, @Param('id') id: number, @Body() userUp: UserUp) {
        const user = await this.userService.updateUser(id, userUp);
        return res.status(HttpStatus.OK).json({
            message: 'Usuario actualizado',
            user,
        });
    }

    @Delete('/:id')
    async deleteUser(@Res() res: Response, @Param('id') id: number) {
        const user = await this.userService.deleteUser(id);
        return res.status(HttpStatus.OK).json({message: 'Usuario eliminado'});
    }

    @Post('/')
    async createUser(@Res() res: Response, @Body() userDTO: UserDTO) {
        const user = await this.userService.createUser(userDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Usuario creado',
            user,
        });
    }
}
