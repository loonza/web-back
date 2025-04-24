import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive, Min } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => Int, { description: 'ID брони' })
  @IsNumber()
  @Min(1, { message: 'ID брони должен быть положительным числом' })
  reservationId: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsPositive()
  months: number;
}
