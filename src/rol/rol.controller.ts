import { Controller, Get, Res, HttpStatus, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { RolService } from './rol.service';
import { Response } from 'express';
import { RolDTO } from './rol.dto';

@Controller('rols')
export class RolController {
    constructor(private rolService: RolService) {}

    @Get('/')
    async getRols(@Res() res: Response) {
        const rols = await this.rolService.getRols();
        return res.status(HttpStatus.OK).json(rols);
    }

    @Get('/single')
    async getRol(@Res() res: Response, @Query('id') id: number) {
        const rol = await this.rolService.getRol(id);
        return res.status(HttpStatus.OK).json(rol);
    }

    @Post('/')
    async createRol(@Res() res: Response, @Body() rolDTO: RolDTO) {
        const newRol = await this.rolService.createRol(rolDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Rol creado',
        });
    }

    @Put('/update')
    async updateRol(@Res() res: Response, @Query('id') id: number, @Body() rolDTO: RolDTO) {
        const rol = await this.rolService.updateRol(id, rolDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Rol actualizado',
        });
    }

    @Delete('/delete')
    async deleteRol(@Res() res: Response, @Query('id') id: number) {
        const rol = await this.rolService.deleteRol(id);
        return res.status(HttpStatus.OK).json({
            message: 'Rol eliminado',
        });
    }
}
