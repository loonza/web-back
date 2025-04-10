import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty()
  @IsUUID()
  warehouseId: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  months: number;
}
