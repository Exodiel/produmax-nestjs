import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { IsString, Length, IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Order } from '../order/order.entity';

@Entity('user')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
    })
    @IsString()
    identification: string;

    @Column({
        type: 'varchar',
        length: 10,
        unique: true,
    })
    @IsString()
    identificationType: string;

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

    @Column({
        type: 'varchar',
        length: 220,
    })
    imageUrl: string;

    async comparePassword(attempt: string): Promise<boolean> {
        return bcrypt.compare(attempt, this.password);
    }
}
