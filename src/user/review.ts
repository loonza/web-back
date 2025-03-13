import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';
import { Warehouse } from './warehouse';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  warehouse: Warehouse;

  @Column({ type: 'int' })
  rating: number;

  @Column('text', { nullable: true })
  comment?: string;

  @CreateDateColumn()
  created_at: Date;
}
