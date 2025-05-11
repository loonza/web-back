import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const onHeaders = require('on-headers');

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isHttp = context.getType<'http'>() === 'http';
    const isGraphQL = context.getType<'graphql'>() === 'graphql';
    const start = Date.now();

    if (isHttp) {
      const req = context.switchToHttp().getRequest<Request>();
      const res = context.switchToHttp().getResponse<Response>();

      const start = Date.now();
      res.locals.startAt = start;

      return next.handle().pipe(
        tap(() => {
          const elapsed = `${Date.now() - start}ms`;
          res.setHeader('X-Elapsed-Time', elapsed);
          res.locals.elapsedTime = elapsed;
          console.log(' Elapsed time:', elapsed);
        }),
      );
    }

    if (isGraphQL) {
      const gqlCtx = GqlExecutionContext.create(context).getContext<{
        res?: Response;
      }>();
      const res = gqlCtx?.res;

      if (res) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        onHeaders(res, () => {
          const elapsed = `${Date.now() - start}ms`;
          res.setHeader('X-Elapsed-Time', elapsed);
          res.locals.elapsedTime = elapsed;
          console.log(`Elapsed time: ${elapsed}`);
        });
      }

      return next.handle().pipe(
        map((data: any) => {
          const elapsed = `${Date.now() - start}ms`;
          if (Array.isArray(data)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data.map((item) => ({ ...item, elapsedTime: elapsed }));
          }
          if (typeof data === 'object' && data !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return { ...data, elapsedTime: elapsed };
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data;
        }),
      );
    }

    return next.handle();
  }
}
