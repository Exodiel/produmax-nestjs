import { SubCategory } from '../sub-category/sub.category.entity';
import { PrimaryColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity('category')
export class Category {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 40,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 220,
    })
    imageUrl: string;
}
