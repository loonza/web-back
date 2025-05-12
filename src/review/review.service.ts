import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Mutex } from 'async-mutex';

@Injectable()
export class ReviewService {
  private readonly mutex = new Mutex();
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const cacheKey = 'review:all';

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      console.log(' review cached');
      return cached;
    }

    return this.mutex.runExclusive(async () => {
      const secondCheck = await this.cache.get(cacheKey);
      if (secondCheck) {
        console.log('review cached after wait');
        return secondCheck;
      }
      console.log(' review not cached');
      const reviews = await this.prisma.review.findMany({
        include: {
          user: true,
          warehouse: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      await this.cache.set(cacheKey, reviews, 10);
      return reviews;
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
