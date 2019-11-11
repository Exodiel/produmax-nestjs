import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from 'typeorm';
import { IsString, IsInt, Min, Length, IsEmail } from 'class-validator';
import { Rol } from '../rol/rol.entity';
import * as bcrypt from 'bcrypt';
import { Order } from '../order/order.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 10,
        unique: true,
    })
    @IsString()
    ci: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    @IsString()
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    lastname: string;

    @Column({
        type: 'varchar',
        length: 11,
    })
    @IsString()
    birthdate: string;

    @Column({
        type: 'varchar',
        length: 180,
        unique: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @Column({
        type: 'varchar',
        length: 90,
        select: false,
    })
    @Length(6, 90)
    password: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    phone: string;

    @ManyToOne(type => Rol, rol => rol.users)
    rol: Rol;

    @OneToMany(type => Order, order => order.user)
    orders: Order[];

    async comparePassword(attempt: string): Promise<boolean> {
        return bcrypt.compare(attempt, this.password);
    }
}
