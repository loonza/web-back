import {
  Controller,
  Post,
  Body,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/public.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('payment')
@UseGuards(AuthGuard)
@Controller('api/payment')
export class PaymentApiController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('')
  @ApiOperation({ summary: 'Создание оплаты' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Оплата успешно создана' })
  @ApiResponse({
    status: 404,
    description: 'Бронь не найдена или склад отсутствует',
  })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
  async create(@Body() dto: CreatePaymentDto) {
    const reservation = await this.paymentService.findReservation(dto);

    if (!reservation) {
      throw new NotFoundException('Бронь не найдена');
    }
    const months = this.paymentService.calculateMonthsBetween(reservation);

    return this.paymentService.create(dto, months);
  }

  @Delete(':reservationId')
  @ApiBearerAuth()
  @Roles(user_role_enum.owner)
  @ApiOperation({ summary: 'Удаление оплаты по ID брони' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 200, description: 'Оплата успешно удалена' })
  @ApiResponse({ status: 404, description: 'Оплата не найдена' })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
  async removeByReservation(@Body() dto: CreatePaymentDto) {
    const payment = await this.paymentService.findReservation(dto);
    if (!payment) {
      throw new NotFoundException('Оплата по данной брони не найдена');
    }

    await this.paymentService.remove(dto.reservationId);
    return { message: 'Оплата удалена' };
  }
}
