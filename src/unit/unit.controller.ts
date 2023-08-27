import { Controller, Get, Res, HttpStatus, NotFoundException, Post, Delete, Put, Body, Query } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'nest-keycloak-connect';
import { UnitService } from './unit.service';
import { UnitDTO } from './unit.dto';

@Controller('units')
export class UnitController {
    constructor(private unitService: UnitService) { }

    @Get('/')
    @Roles({
        roles: ['app-admin']
    })
    async getUnits(@Res() res: Response) {
        const units = await this.unitService.getUnits();
        return res.status(HttpStatus.OK).json(units);
    }

    @Get('/single')
    @Roles({
        roles: ['app-admin']
    })
    async getUnit(@Res() res: Response, @Query('id') id: string) {
        const unit = await this.unitService.getUnit(id);
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }
        return res.status(HttpStatus.OK).json(unit);
    }

    @Post('/')
    @Roles({
        roles: ['app-admin']
    })
    async createUnit(@Res() res: Response, @Body() unitDTO: UnitDTO) {
        const newUnit = await this.unitService.createUnit(unitDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Unidad creada',
        });
    }

    @Delete('/delete')
    @Roles({
        roles: ['app-admin']
    })
    async deleteUnit(@Res() res: Response, @Query('id') id: string) {
        const deletedUnit = await this.unitService.deleteUnit(id);

        return res.status(HttpStatus.OK).json({ message: 'Unidad eliminada' });
    }

    @Put('/update')
    @Roles({
        roles: ['app-admin']
    })
    async updateUnit(@Res() res: Response, @Query('id') id: string, @Body() unitDTO: UnitDTO) {
        const updatedUnit = await this.unitService.updateUnit(id, unitDTO);

        return res.status(HttpStatus.OK).json({
            message: 'Unidad actualizada',
        });
    }
}
