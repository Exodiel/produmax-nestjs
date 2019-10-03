import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';

@Entity('details')
export class Details {

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

    @ManyToOne(type => Product, product => product.details, { primary: true })
    product: Product;

    @ManyToOne(type => Order, order => order.details, { primary: true })
    order: Order;
}
