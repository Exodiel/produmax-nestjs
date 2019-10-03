import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { ProductToOrder } from './productToOrder.entity';
import { User } from '../user/user.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 200,
    })
    @IsString()
    @Length(2, 200)
    address: string;

    @Column({
        type: 'varchar',
        length: 180,
    })
    @IsString()
    neigh: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    state: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    total: number;

    @Column({
        type: 'date',
    })
    date: string;

    @BeforeInsert()
    saveDate() {
        const date = new Date().toLocaleString();
        this.date = date.split(' ')[0]; // dd/mm/yyyy
    }

    @BeforeInsert()
    saveState() {
        this.state = 'procesando';
    }

    @ManyToOne(type => User, user => user.order)
    user: User;

    @OneToMany((type) => ProductToOrder, (productToOrder) => productToOrder.order)
    productToOrders!: ProductToOrder[];

}
