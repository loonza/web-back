import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@ObjectType()
export class Review {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  created_at: Date;

  @Field(() => String, { nullable: true })
  user_id?: string;

  @Field(() => String, { nullable: true })
  warehouse_id?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Field({ nullable: true })
  elapsedTime?: string;
}
