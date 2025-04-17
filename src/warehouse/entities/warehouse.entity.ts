import { Field, Float, Int, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Warehouse {
  @Field(() => ID)
  id: string;

  @Field()
  location: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  description?: string;
}
