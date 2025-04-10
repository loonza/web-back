import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  reservationId: number;
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  months: number;
}
