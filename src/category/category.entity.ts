import { SubCategory } from '../sub-category/sub.category.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 40,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 55,
    })
    imageUrl: string;

    @OneToMany(() => SubCategory, subcategory => subcategory.category)
    subcategories: SubCategory[];
}
