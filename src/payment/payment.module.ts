import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { PaymentApiController } from './payment.api.controller';
import { PaymentResolver } from './payment.resolver';

@Module({
  imports: [PrismaModule, WarehouseModule],
  controllers: [PaymentController, PaymentApiController],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
