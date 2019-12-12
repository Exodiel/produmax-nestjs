import { SubCategory } from '../sub-category/sub.category.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { Image } from '../image/image.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 40,
    })
    name: string;

    @OneToMany(type => SubCategory, subcategory => subcategory.category)
    subcategories: SubCategory[];

    @ManyToOne(type => Image, image => image.categories)
    image: Image;
}
