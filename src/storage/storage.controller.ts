import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { Express, Request, Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Только изображения'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    if (!file) {
      res.status(400).send('Файл не загружен');
    }

    const imageUrl = await this.storageService.uploadFile(file);

    const acceptsHtml = req.headers.accept?.includes('text/html');

    if (acceptsHtml) {
      return res.render('services', { imageUrl });
    } else {
      res.json({ imageUrl });
    }
  }
}
