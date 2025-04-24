import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma.service';
import { Reservation } from './entities/reservation.entity';

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

  async findById(id: number): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }
  async findAlls(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }
  async findByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { user_id: userId },
    });

    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('Резервации для пользователя не найдены');
    }

    return reservations;
  }
}
