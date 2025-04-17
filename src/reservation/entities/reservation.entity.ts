import { ObjectType, Field, Int } from '@nestjs/graphql';

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

  @Field({ nullable: true })
  user_id?: string;

  @Field({ nullable: true })
  warehouse_id?: string;
}
