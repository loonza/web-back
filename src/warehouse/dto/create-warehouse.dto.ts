import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Вместимость должна быть положительным числом' })
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0.01, { message: 'Цена должна быть положительным числом' })
  price: number;

  @ApiProperty()
  @IsString()
  description: string;
}
