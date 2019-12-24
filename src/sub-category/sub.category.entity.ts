import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@Entity('subcategory')
export class SubCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @IsString()
    name: string;

    @Column({
        type: 'varchar',
        length: 55,
    })
    imageUrl: string;

    @OneToMany(type => Product, products => products.subcategory)
    products: Product[];

    @ManyToOne(type => Category, category => category.subcategories)
    category: Category;
}
