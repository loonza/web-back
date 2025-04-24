import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const onHeaders = require('on-headers');

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const isHttp = context.getType<'http'>() === 'http';
    const isGraphQL = context.getType<'graphql'>() === 'graphql';

    if (isHttp) {
      const res = context.switchToHttp().getResponse<Response>();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      onHeaders(res, () => {
        const elapsed = `${Date.now() - start}ms`;
        res.setHeader('X-Elapsed-Time', elapsed);
        res.locals.elapsedTime = elapsed;
        console.log(`[HTTP] Elapsed time: ${elapsed}`);
      });

      return next.handle().pipe(
        map((data: any) => {
          const elapsed = `${Date.now() - start}ms`;
          if (typeof data === 'object' && data !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return { ...data, elapsedTime: elapsed };
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data;
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
          console.log(`[GraphQL] Elapsed time: ${elapsed}`);
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
