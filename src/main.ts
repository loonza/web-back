import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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

  hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  hbs.registerHelper('or', (a, b) => a || b);
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('not', (value) => !value);

  const config = new DocumentBuilder()
    .setTitle('BoxSpace')
    .setDescription('RestAPI')
    .setVersion('1.0')
    .addTag('warehouse')
    .addTag('reservation')
    .addTag('review')
    .addTag('payment')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(` Server is running on http://localhost:${port}`);
}

bootstrap();
