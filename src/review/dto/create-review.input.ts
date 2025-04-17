import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min, Max, IsOptional, IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  warehouse_id?: string;
}
