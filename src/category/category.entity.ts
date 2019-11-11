import { SubCategory } from '../sub-category/sub.category.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 200,
    })
    @IsString()
    imagePath: string;

    @OneToMany(type => SubCategory, subcategory => subcategory.category)
    subcategories: SubCategory[];
}
