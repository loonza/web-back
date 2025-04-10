import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { reservation_status_enum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty()
  status?: reservation_status_enum;
}
