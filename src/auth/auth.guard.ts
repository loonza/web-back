import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = request.session?.user;

    if (!user) throw new UnauthorizedException('Пользователь не авторизован');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Нет доступа');
    }

    return true;
  }
}
