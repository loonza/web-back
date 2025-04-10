import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('review')
@Controller('api/review')
export class ReviewApiController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create/:userId')
  @ApiOperation({ summary: 'Создать отзыв' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID пользователя' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Отзыв создан' })
  create(@Param('userId') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(userId, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить отзывы пользователей' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Список отзывов' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв удалён' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(Number(id));
  }
}
