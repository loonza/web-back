import { Controller, Req, Res, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';

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

    await this.paymentService.create(dto);
    res.redirect('/reservation');
  }
}
