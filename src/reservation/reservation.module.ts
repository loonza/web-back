import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaModule } from '../prisma.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ReservationApiController } from './reservation.api.controller';
import { ReservationResolver } from './reservation.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, WarehouseModule, UserModule],
  controllers: [ReservationController, ReservationApiController],
  providers: [ReservationService, ReservationResolver],
  exports: [ReservationService],
})
export class ReservationModule {}
