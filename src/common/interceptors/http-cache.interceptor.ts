import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType() === 'http';
    if (!isHttp) return next.handle();

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        if (response.headersSent) return;


        const safeData = data as object ?? {};
        const cleanData = JSON.stringify(safeData);
        const etag = crypto.createHash('md5').update(cleanData).digest('hex');

        const ifNoneMatch = request.headers['if-none-match'];

        if (ifNoneMatch === etag) {
          response.status(304).end();
          return EMPTY;
        }

        try {
          response.setHeader('ETag', etag);

          response.setHeader('Cache-Control', 'public, max-age=3600');

          response.setHeader('X-Elapsed-Time', `${Date.now() - start}ms`);
        } catch (err) {
          console.warn('Cannot set headers:', err.message);
        }
      }),
    );
  }
}
