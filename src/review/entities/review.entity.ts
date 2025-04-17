import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

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

  @Field({ nullable: true })
  user_id?: string;

  @Field({ nullable: true })
  warehouse_id?: string;
}
