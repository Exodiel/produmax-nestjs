import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';

@Entity('details')
export class Details {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'smallint',
    })
    quantity: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    price: number;

    @ManyToOne(() => Product, product => product.details)
    product: Product;

    @ManyToOne(() => Order, order => order.details)
    order: Order;
}
