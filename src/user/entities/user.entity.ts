import { ObjectType, Field } from '@nestjs/graphql';
import { user_role_enum } from '@prisma/client';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  role: user_role_enum;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  elapsedTime?: string;
}
