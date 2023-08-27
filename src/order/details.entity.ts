import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('details')
export class Details {
    @PrimaryColumn('uuid')
    id: string

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

    @Column('uuid')
    productId: string;

    @Column('uuid')
    orderId: string;
}
