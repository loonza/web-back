import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma.module';
import { UserApiController } from './user.api.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, UserApiController],
  providers: [UserService],
})
export class UserModule {}
