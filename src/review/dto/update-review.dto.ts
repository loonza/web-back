import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty()
  @IsNumber()
  rating?: number;

  @ApiProperty()
  @IsString()
  comment?: string;
}
