import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';

@Entity('productToOrder')
export class ProductToOrder {
    @PrimaryGeneratedColumn()
    productToOrder!: number;

    @Column()
    productId!: number;

    @Column()
    orderId!: number;

    @Column({
        type: 'smallint',
    })
    quantity!: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    price!: number;

    @ManyToOne(type => Product, product => product.productToOrders)
    product!: Product;

    @ManyToOne(type => Order, order => order.productToOrders)
    order!: Order;
}
