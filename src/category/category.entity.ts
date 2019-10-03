import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    name: string;

    @OneToMany(type => Product, product => product.category)
    product: Product[];
}
