import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Delete, Put, Body, Query } from '@nestjs/common';
import { UnitService } from './unit.service';
import { Response } from 'express';
import { UnitDTO } from './unit.dto';

@Controller('units')
export class UnitController {
    constructor(private unitService: UnitService) {}

    @Get('/')
    async getUnits(@Res() res: Response) {
        const units = await this.unitService.getUnits();
        return res.status(HttpStatus.OK).json(units);
    }

    @Get('/single')
    async getUnit(@Res() res: Response, @Query('id') id: number) {
        const unit = await this.unitService.getUnit(id);
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }
        return res.status(HttpStatus.OK).json(unit);
    }

    @Post('/')
    async createUnit(@Res() res: Response, @Body() unitDTO: UnitDTO) {
        const newUnit = await this.unitService.createUnit(unitDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Unidad creada',
        });
    }

    @Delete('/delete')
    async deleteUnit(@Res() res: Response, @Query('id') id: number) {
        const deletedUnit = await this.unitService.deleteUnit(id);

        return res.status(HttpStatus.OK).json({message: 'Unidad eliminada'});
    }

    @Put('/update')
    async updateUnit(@Res() res: Response, @Query('id') id: number, @Body() unitDTO: UnitDTO) {
        const updatedUnit = await this.unitService.updateUnit(id, unitDTO);

        return res.status(HttpStatus.OK).json({
            message: 'Unidad actualizada',
        });
    }
}
