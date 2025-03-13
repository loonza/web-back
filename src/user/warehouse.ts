import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("text", { nullable: true })
  description?: string;
}
