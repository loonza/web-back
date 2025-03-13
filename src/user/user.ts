import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation';
import { Review } from './review';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['tenant', 'owner'] })
  role: 'tenant' | 'owner';

  @CreateDateColumn()
  created_at: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
