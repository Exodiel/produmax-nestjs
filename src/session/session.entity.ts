
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Session  {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  token: string;

  @Column({
    type: 'varchar',
    length: 120,
  })
  payload: string;

  @Column({
    type: 'int',
  })
  expiresAt: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  lastActivity: string;

  @ManyToOne(type => User, user => user.sessions)
  user: User;
}
