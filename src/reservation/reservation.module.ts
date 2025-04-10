import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaModule } from '../prisma.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ReservationApiController } from './reservation.api.controller';

@Module({
  imports: [PrismaModule, WarehouseModule],
  controllers: [ReservationController, ReservationApiController],
  providers: [ReservationService],
})
export class ReservationModule {}
