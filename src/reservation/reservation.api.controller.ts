import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  BadRequestException, UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('reservation')
@UseGuards(AuthGuard)
@Controller('api/reservation')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ReservationApiController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Создать бронирование для пользователя' })
  @ApiParam({ name: 'userId', type: String, description: 'ID пользователя' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ status: 201, description: 'Бронирование создано' })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiResponse({
    status: 404,
    description: 'Ошибка создания, проверьте вводиммые данные',
  })
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreateReservationDto,
  ) {
    if (dto.months <= 0) {
      throw new BadRequestException(
        'Количество месяцев должно быть положительным числом',
      );
    }
    try {
      return await this.reservationService.create(userId, dto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        'Не удалось создать бронирование, введите корректные данные',
      );
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить бронирования пользователя' })
  @ApiParam({ name: 'userId', type: String, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список бронирований с привязкой к складам',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  async findAll(@Param('userId') userId: string) {
    const reservations = await this.reservationService.findAll(userId);
    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('Бронирования не найдены');
    }
    return reservations;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить бронирование' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Бронирование удалено' })
  @ApiResponse({ status: 400, description: 'Бронирование не найдено' })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  async remove(@Param('id') id: string) {
    if (!id || Number(id) <= 0) {
      throw new BadRequestException(
        'ID бронирования должен быть положительным числом',
      );
    }
    try {
      return await this.reservationService.remove(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Бронирование не найдено');
      }
      throw new BadRequestException(
        'Не удалось удалить бронирование, введите правильный id',
      );
    }
  }
}
