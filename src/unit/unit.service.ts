import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UnitDTO } from './unit.dto';
import { Unit } from './unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UnitService {
    constructor(@InjectRepository(Unit) private readonly unitRepository: Repository<Unit>) {}

    async getUnits(): Promise<Unit[]> {
        const units = await this.unitRepository.find();
        return units;
    }

    async getUnit(id: number): Promise<Unit> {
        const unit = await this.unitRepository.findOneOrFail(id);
        return unit;
    }

    async getUnitByName(name: string): Promise<Unit> {
        const unit = await this.unitRepository.findOne({ name });
        return unit;
    }

    async createUnit(unitDTO: UnitDTO): Promise<Unit> {
        const unit = await this.unitRepository.save(unitDTO);
        return unit;
    }

    async updateUnit(unitId: number, unitDTO: UnitDTO): Promise<Unit> {
        let unit = await this.unitRepository.findOneOrFail({ id: unitId });
        if (!unit) {
            throw new HttpException('No se encontró la unidad', HttpStatus.NOT_FOUND);
        }
        await this.unitRepository.update({id: unitId}, unitDTO);
        unit = await this.unitRepository.findOneOrFail({ id: unitId });
        return unit;
    }

    async deleteUnit(unitId: number): Promise<any> {
        let unit = await this.unitRepository.findOneOrFail({ id: unitId });
        if (!unit) {
            throw new HttpException('No se encontró la unidad', HttpStatus.NOT_FOUND);
        }
        await this.unitRepository.delete({id: unitId});
        unit = await this.unitRepository.findOneOrFail({ id: unitId });
        return unit;
    }
}
