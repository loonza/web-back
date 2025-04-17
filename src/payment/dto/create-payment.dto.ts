import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsInt({ message: 'ID брони должен быть числом' })
  @Min(1, { message: 'ID брони должен быть положительным числом' })
  reservationId: number;
}
