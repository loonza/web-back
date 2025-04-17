import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        warehouse: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async create(userId: string, dto: CreateReviewDto) {
    const lastReservation = await this.prisma.reservation.findFirst({
      where: { user_id: userId },
      orderBy: { end_date: 'desc' },
      include: { warehouse: true },
    });
    if (!lastReservation || !lastReservation.warehouse) {
      throw new NotFoundException(`У пользователя нет брони`);
    }

    const review = await this.prisma.review.create({
      data: {
        rating: Number(dto.rating),
        comment: dto.comment,
        user_id: userId,
        warehouse_id: lastReservation.warehouse_id,
      },
    });
    return review;
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }

    return review;
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Отзыв не найден');

    await this.prisma.review.delete({ where: { id } });
  }
}
