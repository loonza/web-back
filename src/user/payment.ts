import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reservation_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'failed';

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;
}
