import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { UploadController } from './storage.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: 'ru-central1',
          endpoint: 'https://storage.yandexcloud.net',
          credentials: {
            accessKeyId: configService.get<string>('YANDEX_ACCESS_KEY')!,
            secretAccessKey: configService.get<string>('YANDEX_SECRET_KEY')!,
          },
        });
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
