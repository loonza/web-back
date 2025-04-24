import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ReviewResolver } from './review.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, WarehouseModule, UserModule],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ReviewResolver],
})
export class ReviewModule {}
