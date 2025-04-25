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
import { ElapsedTimeInterceptor } from './common/interceptors/time.interceptor';
import { middleware } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { errorHandler } from 'supertokens-node/framework/express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log('URI:', process.env.SUPERTOKENS_CONNECTION_URI);
  console.log('API KEY:', process.env.SUPERTOKENS_API_KEY);

  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI:
        process.env.SUPERTOKENS_CONNECTION_URI ??
        (() => {
          throw new Error('SUPERTOKENS_CONNECTION_URI is not defined');
        })(),
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: 'Your App Name',
      apiDomain: 'https://m3312-vafaullin.onrender.com',
      websiteDomain: 'https://m3312-vafaullin.onrender.com',
    },
    recipeList: [EmailPassword.init(), Session.init()],
  });

  app.use(
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
  app.useGlobalInterceptors(new ElapsedTimeInterceptor());
  app.use(
    cors({
      origin: 'https://m3312-vafaullin.onrender.com',
      allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
      credentials: true,
    }),
  );
  app.use(middleware());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(errorHandler());
  // app.enableCors({
  //   origin: 'http://localhost:4000',
  //   credentials: true,
  // });

  app.use((req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalRender = res.render;
    res.render = function (
      view,
      options: Record<string, any> = {},
      callback,
    ): any {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options.elapsedTime = res.locals.elapsedTime;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
      return originalRender.call(this, view, options, callback);
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    next();
  });

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
    .addCookieAuth('sAccessToken')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
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
