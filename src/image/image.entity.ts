import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';
import { SubCategory } from '../sub-category/sub.category.entity';

@Entity('image')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 15,
    })
    typeEntity: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    filepath: string;

    @OneToMany(type => Category, category => category.image)
    categories: Category[];

    @OneToMany(type => SubCategory, subcategory => subcategory.image)
    subcategories: SubCategory[];

    @OneToMany(type => Product, product => product.image)
    products: Product[];

    @OneToMany(type => User, user => user.image)
    users: User[];
}
