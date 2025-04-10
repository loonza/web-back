import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: Number(dto.reservationId) },
      include: { warehouse: true },
    });

    if (!reservation || !reservation.warehouse) {
      throw new Error('Reservation or warehouse not found');
    }

    const amount = Number(reservation.warehouse.price) * dto.months;

    await this.prisma.reservation.update({
      where: { id: Number(dto.reservationId) },
      data: { status: 'confirmed' },
    });

    return this.prisma.payment.create({
      data: {
        reservation_id: Number(dto.reservationId),
        amount,
        status: 'paid',
        paid_at: new Date(),
      },
    });
  }

  async remove(reservationId: number) {
    return this.prisma.payment.deleteMany({
      where: { reservation_id: reservationId },
    });
  }
}
