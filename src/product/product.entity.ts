import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Unit } from '../unit/unit.entity';
import { IsString, Length, IsInt } from 'class-validator';
import { SubCategory } from '../sub-category/sub.category.entity';
import { Details } from '../order/details.entity';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

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
        length: 200,
    })
    @IsString()
    imagePath: string;

    @ManyToOne(type => Unit, unit => unit.products)
    unit: Unit;

    @ManyToOne(type => SubCategory, subcategory => subcategory.products)
    subcategory: SubCategory;

    @OneToMany(type => Details, (details) => details.product)
    details: Details[];
}
