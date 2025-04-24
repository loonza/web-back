import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

function removeElapsedTime(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeElapsedTime);
  } else if (obj && typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clone = { ...obj };
    delete clone.elapsedTime;
    for (const key in clone) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clone[key] = removeElapsedTime(clone[key]);
    }
    return clone;
  }
  return obj;
}

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType<'http'>() === 'http';
    if (!isHttp) return next.handle();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((data) => {
        if (res.headersSent) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const cleanData = removeElapsedTime(data);
        const body = JSON.stringify(cleanData);
        const etag = crypto.createHash('md5').update(body).digest('hex');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const ifNoneMatch = req.headers['if-none-match'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        res.setHeader('ETag', etag);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        res.setHeader('Cache-Control', 'public, max-age=3600');

        if (ifNoneMatch === etag) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          res.status(304).end();
        }
      }),
    );
  }
}
