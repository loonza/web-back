import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, months: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: Number(dto.reservationId) },
      include: { warehouse: true },
    });

    if (!reservation) {
      throw new NotFoundException('Бронь не найдена');
    }

    if (!reservation.warehouse) {
      throw new NotFoundException('Склад, связанный с бронью, не найден');
    }

    const amount = Number(reservation.warehouse.price) * months;

    await this.prisma.reservation.update({
      where: { id: Number(dto.reservationId) },
      data: { status: 'confirmed' },
    });

    const payment = await this.prisma.payment.create({
      data: {
        reservation_id: Number(dto.reservationId),
        amount: new Decimal(amount), // сохраняем как Decimal в БД
        status: 'paid',
        paid_at: new Date(),
      },
    });

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  }

  calculateMonthsBetween(reservation: {
    start_date: Date;
    end_date: Date;
  }): number {
    const start = new Date(reservation.start_date);
    const end = new Date(reservation.end_date);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  }

  async findReservation(dto: CreatePaymentDto) {
    return this.prisma.reservation.findUnique({
      where: { id: dto.reservationId },
    });
  }

  async remove(reservationId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { reservation_id: reservationId },
    });

    if (!payment) {
      throw new NotFoundException('Оплата не найдена');
    }

    await this.prisma.payment.delete({
      where: { id: payment.id },
    });

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  }

  async findAllPayments() {
    return this.prisma.payment.findMany({});
  }
}
