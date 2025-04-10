import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsString()
  description: string;
}
