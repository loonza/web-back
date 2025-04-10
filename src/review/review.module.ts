import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [PrismaModule, WarehouseModule],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
