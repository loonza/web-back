import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateWarehouseInput {
  @Field(() => String, { description: 'Название склада' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @Field(() => Number, { description: 'Вместительность склада' })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @Field(() => Int, { description: 'Стоимость аренды в месяц' })
  @IsPositive()
  @Min(1)
  price: number;

  @Field(() => String, { description: 'Описание склада' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
