import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateReservationDto) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + dto.months);
    return this.prisma.reservation.create({
      data: {
        user_id: userId,
        warehouse_id: dto.warehouseId,
        start_date: startDate,
        end_date: endDate,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.reservation.findMany({
      where: { user_id: userId },
      include: {
        warehouse: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.reservation.delete({ where: { id } });
  }

  update(id: number, dto: UpdateReservationDto) {
    return this.prisma.reservation.update({ where: { id }, data: dto });
  }
}
