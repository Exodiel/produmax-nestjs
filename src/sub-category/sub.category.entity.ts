import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@Entity('subcategory')
export class SubCategory {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @IsString()
    name: string;

    @Column({
        type: 'varchar',
        length: 220,
    })
    imageUrl: string;

    @Column('uuid')
    categoryId: string;
}
