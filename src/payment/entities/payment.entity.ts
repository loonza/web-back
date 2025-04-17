import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  reservation_id: number;

  @Field(() => Float)
  amount: number;

  @Field(() => String)
  status: string;

  @Field(() => Date, { nullable: true })
  paid_at: Date | null;
}
