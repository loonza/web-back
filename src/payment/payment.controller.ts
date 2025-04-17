import { Controller, Req, Res, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiExcludeController } from '@nestjs/swagger';


@ApiExcludeController()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  async pay(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) return res.redirect('/login');

    const reservation = await this.paymentService.findReservation(dto);

    if (!reservation) {
      return res.status(404).render('errors/not-found', {
        message: 'Бронирование не найдено',
      });
    }

    const months = this.paymentService.calculateMonthsBetween(reservation);

    await this.paymentService.create(dto, months);
    res.redirect('/reservation');
  }
}
