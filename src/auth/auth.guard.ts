import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.session?.user as
      | {
          id: string;
          username: string;
          email?: string;
          password: string;
          role: string;
        }
      | undefined;

    if (!user) throw new UnauthorizedException('Пользователь не авторизован');
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Нет доступа');
    }

    return true;
  }
}
