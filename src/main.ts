import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as moment from 'moment';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { PrismaExceptionFilter } from './exception.filter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    session({
      secret: 'loonza',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());

  hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  hbs.registerHelper('or', (a, b) => a || b);
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('not', (value) => !value);
  hbs.registerHelper('formatDate', function (date: Date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
  });

  const config = new DocumentBuilder()
    .setTitle('BoxSpace')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      WarehouseModule,
      ReservationModule,
      ReviewModule,
      PaymentModule,
      UserModule,
    ],
  });

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(` Server is running on http://localhost:${port}`);
}

bootstrap();
