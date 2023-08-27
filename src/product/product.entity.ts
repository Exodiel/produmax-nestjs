import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Unit } from '../unit/unit.entity';
import { IsString, Length, IsInt } from 'class-validator';
import { SubCategory } from '../sub-category/sub.category.entity';
import { Details } from '../order/details.entity';

@Entity('product')
export class Product {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 120,
    })
    @IsString()
    @Length(3, 120)
    name: string;

    @Column({
        type: 'varchar',
        length: 180,
    })
    @IsString()
    detail: string;

    @Column({
        type: 'smallint',
    })
    @IsInt()
    stock: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    unitPrice: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    weight: number;

    @Column({
        type: 'varchar',
        length: 220,
    })
    imageUrl: string;

    @Column('uuid')
    unitId: string;

    @Column('uuid')
    subcategoryId: string;
}
