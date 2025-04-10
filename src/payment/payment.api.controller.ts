import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('payment')
@Controller('api/payment')
export class PaymentApiController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создание оплаты' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Оплата успешно создана' })
  @ApiResponse({
    status: 404,
    description: 'Бронь не найдена или склад отсутствует',
  })
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Delete('delete/:reservationId')
  @ApiOperation({ summary: 'Удаление оплаты по ID брони' })
  @ApiParam({ name: 'reservationId', type: Number })
  @ApiResponse({ status: 204, description: 'Оплата успешно удалена' })
  async removeByReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.paymentService.remove(reservationId);
  }
}
