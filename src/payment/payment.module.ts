import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { PaymentApiController } from './payment.api.controller';
import { PaymentResolver } from './payment.resolver';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [PrismaModule, WarehouseModule, ReservationModule],
  controllers: [PaymentController, PaymentApiController],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
