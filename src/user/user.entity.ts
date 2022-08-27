import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from 'typeorm';
import { IsString, Length, IsEmail } from 'class-validator';
import { Rol } from '../rol/rol.entity';
import * as bcrypt from 'bcrypt';
import { Order } from '../order/order.entity';
import { Session } from '../session/session.entity';

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

    @Column({
        type: 'varchar',
        length: 55,
    })
    imageUrl: string;

    @ManyToOne(() => Rol, rol => rol.users)
    rol: Rol;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Session, session => session.user)
    sessions: Session[];

    async comparePassword(attempt: string): Promise<boolean> {
        return bcrypt.compare(attempt, this.password);
    }
}
