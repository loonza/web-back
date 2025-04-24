import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType() === 'http';
    if (!isHttp) return next.handle();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = context.switchToHttp().getResponse();
    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        if (response.headersSent) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const safeData = data ?? {};
        const cleanData = JSON.stringify(safeData);
        const etag = crypto.createHash('md5').update(cleanData).digest('hex');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const ifNoneMatch = request.headers['if-none-match'];

        if (ifNoneMatch === etag) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          response.status(304).end();
          return EMPTY;
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          response.setHeader('ETag', etag);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          response.setHeader('Cache-Control', 'public, max-age=3600');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          response.setHeader('X-Elapsed-Time', `${Date.now() - start}ms`);
        } catch (err) {
          // если вдруг заголовки уже были отправлены
          console.warn('Cannot set headers:', err.message);
        }
      }),
    );
  }
}
