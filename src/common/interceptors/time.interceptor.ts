import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const onHeaders = require('on-headers');

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const isHttp = context.getType<'http'>() === 'http';
    const isGraphQL = context.getType<'graphql'>() === 'graphql';

    if (isHttp) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = context.switchToHttp().getResponse();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      onHeaders(response, () => {
        const elapsed = `${Date.now() - start}ms`;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        response.setHeader('X-Elapsed-Time', elapsed);
        response.locals.elapsedTime = elapsed;
        console.log(`[HTTP] Elapsed time: ${elapsed}`);
      });

      return next.handle().pipe(
        map((data) => {
          const elapsed = `${Date.now() - start}ms`;
          if (isHttp && typeof data === 'object' && data !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return {
              ...data,
              elapsedTime: elapsed,
            };
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data;
        }),
      );
    }

    if (isGraphQL) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = gqlCtx?.res;

      if (response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        onHeaders(response, () => {
          const elapsed = `${Date.now() - start}ms`;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          response.setHeader('X-Elapsed-Time', elapsed);
          response.locals.elapsedTime = elapsed;
          console.log(` [GraphQL] Elapsed time: ${elapsed}`);
        });
      }

      return next.handle().pipe(
        map((data) => {
          const elapsed = `${Date.now() - start}ms`;
          if (typeof data === 'object') {
            if (Array.isArray(data)) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return data.map((item) => ({ ...item, elapsedTime: elapsed }));
            }
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
