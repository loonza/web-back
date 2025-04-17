import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class CreateReservationInput {
  @Field(() => String, { description: 'ID склада' })
  @IsUUID()
  warehouseId: string;

  @Field(() => Number, { description: 'Количество месяцев бронирования' })
  @IsNumber()
  months: number;
}
