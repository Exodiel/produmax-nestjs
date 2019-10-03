import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
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
        type: 'smallint',
    })
    @IsInt()
    @Min(18)
    age: number;

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
    })
    @Length(6, 90)
    password: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    phone: string;

    @OneToOne(type => Rol, rol => rol.user)
    @JoinColumn()
    rol: Rol;

    @OneToMany(type => Order, order => order.user)
    order: Order[];

    @BeforeInsert()
    async hassPasword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }
}
