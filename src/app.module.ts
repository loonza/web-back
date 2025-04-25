// src/app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/common/cache';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const depthLimit = require('graphql-depth-limit');

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: '/graphql',
      sortSchema: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      validationRules: [depthLimit(3)],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 100,
      store: 'memory',
    }),
    StorageModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
      apiKey: process.env.SUPERTOKENS_API_KEY,
      appInfo: {
        appName: 'MyApp',
        apiDomain: 'https://m3312-vafaullin.onrender.com',
        websiteDomain: 'https://m3312-vafaullin.onrender.com',
      },
    }),
    PrismaModule,
    ReservationModule,
    UserModule,
    WarehouseModule,
    PaymentModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes();
  }
}
