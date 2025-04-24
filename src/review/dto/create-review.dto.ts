import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  rating: number;

  @ApiProperty()
  @IsString()
  comment?: string;
}
