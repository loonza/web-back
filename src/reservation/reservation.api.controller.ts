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

@ApiTags('reservation')
@Controller('api/reservation')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ReservationApiController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create/:userId')
  @ApiOperation({ summary: 'Создать бронирование для пользователя' })
  @ApiParam({ name: 'userId', type: String, description: 'ID пользователя' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ status: 201, description: 'Бронирование создано' })
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationService.create(userId, dto);
  }

  @Get('search/:userId')
  @ApiOperation({ summary: 'Получить бронирования пользователя' })
  @ApiParam({ name: 'userId', type: String, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список бронирований с привязкой к складам',
  })
  async findAll(@Param('userId') userId: string) {
    const reservations = await this.reservationService.findAll(userId);
    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('Бронирования не найдены');
    }
    return reservations;
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удалить бронирование' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Бронирование удалено' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  async remove(@Param('id') id: string) {
    return this.reservationService.remove(Number(id));
  }
}
