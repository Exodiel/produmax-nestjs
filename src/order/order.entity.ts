import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { Details } from './details.entity';
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

    @ManyToOne(type => User, user => user.orders)
    user: User;

    @OneToMany(type => Details, (details) => details.order)
    details: Details[];

}
