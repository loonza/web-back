import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PrismaModule } from '../prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WarehouseApiController } from './warehouse.api.controller';
import { WarehouseResolver } from './warehouse.resolver';

@Module({
  imports: [PrismaModule, EventEmitterModule.forRoot()],
  controllers: [WarehouseController, WarehouseApiController],
  providers: [WarehouseService, WarehouseResolver],
})
export class WarehouseModule {}
