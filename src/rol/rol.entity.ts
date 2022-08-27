import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

    @OneToMany(() => User, user => user.rol)
    users: User[];
}
