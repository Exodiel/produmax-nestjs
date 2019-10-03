import { AuthGuard } from '../guards/auth.guard';
import { Controller, Get, Res, HttpStatus, Param, Post, Body, Put, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { RolService } from './rol.service';
import { Response } from 'express';
import { RolDTO } from './rol.dto';
import { Reflector } from '@nestjs/core';

@Controller('rols')
export class RolController {
    constructor(private rolService: RolService) {}

    @Get('/')
    async getRols(@Res() res: Response) {
        const rols = await this.rolService.getRols();
        return res.status(HttpStatus.OK).json(rols);
    }

    @Get('/:id')
    async getRol(@Res() res: Response, @Param('id') id: number) {
        const rol = await this.rolService.getRol(id);
        return res.status(HttpStatus.OK).json(rol);
    }

    @Post('/')
    async createRol(@Res() res: Response, @Body() rolDTO: RolDTO) {
        const newRol = await this.rolService.createRol(rolDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Rol creado',
            newRol,
        });
    }

    @Put('/:id')
    async updateRol(@Res() res: Response, @Param('id') id: number, @Body() rolDTO: RolDTO) {
        const rol = await this.rolService.updateRol(id, rolDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Rol actualizado',
            rol,
        });
    }

    @Delete('/:id')
    async deleteRol(@Res() res: Response, @Param('id') id: number) {
        const rol = await this.rolService.deleteRol(id);
        return res.status(HttpStatus.OK).json({
            message: 'Rol eliminado',
        });
    }
}
