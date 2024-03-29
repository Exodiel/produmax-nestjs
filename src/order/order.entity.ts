import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { IsString, Length } from 'class-validator';

@Entity('order')
export class Order {
    @PrimaryColumn('uuid')
    id: string;

    @Column('uuid')
    userId: string;

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
        type: 'varchar',
        length: 11,
    })
    @IsString()
    date: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @IsString()
    dateDelivery: string;

    @BeforeInsert()
    saveDate() {
        const date = new Date().toLocaleString();
        this.date = date.split(' ')[0]; // dd/mm/yyyy
    }

    @BeforeInsert()
    saveState() {
        this.state = 'procesando';
    }

}
