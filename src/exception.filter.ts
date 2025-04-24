import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const isGraphQL = host.getType<string>() === 'graphql';

    let message = 'Произошла ошибка';
    let statusCode = 400;

    if (exception.code === 'P2025') {
      message = 'Запись не найдена';
      statusCode = 404;
    }

    if (exception.code === 'P2003') {
      const field = exception.meta?.field_name as string;

      if (field.includes('user_id')) {
        message = 'Пользователь с таким ID не найден';
        statusCode = 404;
      } else if (field.includes('warehouse_id')) {
        message = 'Склад с таким ID не найден';
        statusCode = 404;
      } else if (field.includes('reservation_id')) {
        message = 'Бронь с таким ID не найдена';
        statusCode = 404;
      } else {
        message = 'Ошибка';
      }

      if (isGraphQL) {
        if (statusCode === 404) throw new NotFoundException(message);
        if (statusCode === 409) throw new ConflictException(message);
        throw new BadRequestException(message);
      }

      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<{ url: string }>();

      return response.status(statusCode).json({
        statusCode,
        message,
        path: request?.url,
      });
    }

    throw new InternalServerErrorException('Необработанная ошибка');
  }
}
