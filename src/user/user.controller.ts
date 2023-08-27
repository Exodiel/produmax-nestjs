import { Controller, Get, Res, HttpStatus, Put, Body, Delete, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { Roles } from 'nest-keycloak-connect';
import { UserDTO } from './user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('/')
    @Roles({
        roles: ['app-admin']
    })
    async getUsers(@Res() res: Response) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/single')
    @Roles({
        roles: ['app-admin', 'app-user']
    })
    async getUser(@Res() res: Response, @Query('id') id: string) {
        const user = await this.userService.getUser(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('/cedula')
    @Roles({
        roles: ['app-admin']
    })
    async getUserCi(@Res() res: Response, @Query('ci') ci: string) {
        const user = await this.userService.getUserCI(ci);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('/counter')
    @Roles({
        roles: ['app-admin']
    })
    async getUserCounter(@Res() res: Response) {
        const counter = await this.userService.getCountUsers();
        return res.status(HttpStatus.OK).json(counter);
    }

    @Get('/orders')
    @Roles({
        roles: ['app-admin', 'app-user']
    })
    async getOrdersRelationated(@Res() res: Response, @Query('userId') userId: string) {
        const orders = await this.userService.getOrdersRelationated(userId);
        return res.status(HttpStatus.OK).json(orders);
    }

    @Put('/update')
    @Roles({
        roles: ['app-admin', 'app-user']
    })
    async updateUser(@Res() res: Response, @Query('id') id: string, @Body() userDTO: UserDTO) {
        await this.userService.updateUser(id, userDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Usuario actualizado',
        });
    }

    @Put('/update-password')
    @Roles({
        roles: ['app-admin', 'app-user']
    })
    async updateUserPassword(@Res() res: Response, @Query('id') id: string, @Body() data: any) {
        const { password } = data;
        const message = await this.userService.updatePassword(password, id);
        return res.status(HttpStatus.OK).json({
            message,
        });
    }

    @Delete('/delete')
    @Roles({
        roles: ['app-admin']
    })
    async deleteUser(@Res() res: Response, @Query('id') id: string) {
        await this.userService.deleteUser(id);
        return res.status(HttpStatus.OK).json({ message: 'Usuario eliminado' });
    }

    @Post('/create')
    @Roles({
        roles: ['app-admin']
    })
    async createUser(@Res() res: Response, @Body() userDTO: UserDTO) {
        await this.userService.createUser(userDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Usuario creado',
        });
    }
}
