import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  try {

    app.useStaticAssets(join(__dirname, 'public'), {
      prefix: '/',
    });


    app.setBaseViewsDir(join(__dirname, 'views'));
    app.setViewEngine('hbs');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  } catch (error) {
    console.error('🔥 Ошибка при запуске сервера:', error);
  }
}
bootstrap();
