import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType() === 'http';
    if (!isHttp) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();

    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        const body = JSON.stringify(data);
        const etag = crypto.createHash('md5').update(body).digest('hex');

        const ifNoneMatch = req.headers['if-none-match'];

        res.setHeader('ETag', etag);

        res.setHeader('Cache-Control', 'public, max-age=3600');

        if (ifNoneMatch === etag) {
          res.status(304).end();
        }
      }),
    );
  }
}
