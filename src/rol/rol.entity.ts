import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';

@Entity('rols')
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 20,
    })
    @IsString()
    @Length(1, 20)
    name: string;

    @OneToOne(type => User, user => user.rol)
    user: User;
}
