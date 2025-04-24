import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const key = request.originalUrl;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const cached = await this.cacheManager.get(key);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      tap(async (response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.cacheManager.set(key, response, 10);
      }),
    );
  }
}
