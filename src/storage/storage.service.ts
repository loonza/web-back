// src/storage/storage.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import * as path from 'node:path';

@Injectable()
export class StorageService {
  constructor(@Inject('S3_CLIENT') private readonly s3: S3Client) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `${uuid()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: 'm3312-vafaullin',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
    } catch (err) {
      console.error('Ошибка при загрузке в S3:', err);
      throw err;
    }

    return `https://storage.yandexcloud.net/m3312-vafaullin/${key}`;
  }
}
