import { Controller, Get, Res, HttpStatus, Put, Body, Delete, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDTO } from './user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    async getUsers(@Res() res: Response) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/single')
    async getUser(@Res() res: Response, @Query('id') id: number) {
        const user = await this.userService.getUser(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('/cedula')
    async getUserCi(@Res() res: Response, @Query('ci') ci: string) {
        const user = await this.userService.getUserCI(ci);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('/counter')
    async getUserCounter(@Res() res: Response) {
        const counter = await this.userService.getCountUsers();
        return res.status(HttpStatus.OK).json(counter);
    }

    @Get('/orders')
    async getOrdersRelationated(@Res() res: Response, @Query('userId') userId: number) {
        const orders = await this.userService.getOrdersRelationated(userId);
        return res.status(HttpStatus.OK).json(orders);
    }

    @Put('/update')
    async updateUser(@Res() res: Response, @Query('id') id: number, @Body() userDTO: UserDTO) {
        const user = await this.userService.updateUser(id, userDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Usuario actualizado',
        });
    }

    @Put('/update-password')
    async updateUserPassword(@Res() res: Response, @Query('id') id: number, @Body() data: any) {
        const { password } = data;
        const message = await this.userService.updatePassword(password, id);
        return res.status(HttpStatus.OK).json({
            message,
        });
    }

    @Delete('/delete')
    async deleteUser(@Res() res: Response, @Query('id') id: number) {
        const user = await this.userService.deleteUser(id);
        return res.status(HttpStatus.OK).json({message: 'Usuario eliminado'});
    }

    @Post('/create')
    async createUser(@Res() res: Response, @Body() userDTO: UserDTO) {
        const user = await this.userService.createUser(userDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Usuario creado',
        });
    }
}
