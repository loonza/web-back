import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as session from 'express-session';

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

  hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(` Server is running on http://localhost:${port}`);
}

bootstrap();
