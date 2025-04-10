import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { payment_status_enum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty()
  status: payment_status_enum;
}
