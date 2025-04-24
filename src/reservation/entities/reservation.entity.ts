import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@ObjectType()
export class Reservation {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  start_date: Date;

  @Field(() => Date)
  end_date: Date;

  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  user_id?: string | null;

  @Field(() => String, { nullable: true })
  warehouse_id?: string | null;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Field({ nullable: true })
  elapsedTime?: string;
}
