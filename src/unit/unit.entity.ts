import { PrimaryColumn, Column, Entity, OneToMany } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { Product } from '../product/product.entity';

@Entity('unit')
export class Unit {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    @IsString()
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    @Length(1, 20)
    symbol: string;
}
