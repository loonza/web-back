import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/common/cache';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/public.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('warehouse')
@UseGuards(AuthGuard)
@Controller('api/warehouse')
export class WarehouseApiController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('')
  @ApiOperation({ summary: 'Получить все склады с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список складов получен' })
  @ApiResponse({
    status: 400,
    description: 'Ошибка при ввода значений пагинации',
  })
  @CacheTTL(10) // TTL 10 секунд
  async findAll(
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    if (page < 1) {
      throw new BadRequestException(
        'Параметр page должен быть больше или равен 1',
      );
    }
    if (limit < 1) {
      throw new BadRequestException('Параметр limit должен быть больше 0');
    }

    const [data, total] = (await this.warehouseService.findAllPaginated(
      page,
      limit,
    )) as [any[], number];

    const totalPages = Math.ceil(total / limit);
    const links: string[] = [];

    if (page > 1) {
      links.push(`<api/warehouse?page=${page - 1}&limit=${limit}>; rel="prev"`);
    }
    if (page < totalPages) {
      links.push(`<api/warehouse?page=${page + 1}&limit=${limit}>; rel="next"`);
    }
    console.log(`📦 Вызов findAll: page=${page}, limit=${limit}`);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      links,
    };
  }

  @Get(':location')
  @ApiOperation({ summary: 'Получить склад по location' })
  @ApiParam({ name: 'location', type: String })
  @ApiResponse({ status: 200, description: 'Склад найден' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async search(@Param('location') location: string) {
    const warehouse = await this.warehouseService.search(location);
    if (!warehouse) throw new NotFoundException('Склад не найден');
    if (!location || location.trim() === '') {
      throw new BadRequestException('Локация не может быть пустой строкой');
    }
    return warehouse;
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.owner)
  @ApiOperation({ summary: 'Создать новый склад' })
  @ApiResponse({ status: 201, description: 'Склад создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiBody({ type: CreateWarehouseDto })
  async create(@Body() dto: CreateWarehouseDto) {
    try {
      return await this.warehouseService.create(dto);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ошибка при создании склада',
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.owner)
  @ApiOperation({ summary: 'Удалить склад' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Склад удалён' })
  @ApiResponse({ status: 400, description: 'Склад не найден' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.warehouseService.remove(id);
      if (!result) throw new NotFoundException('Склад не найден');
      return { message: 'Склад успешно удален' };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Невверно введен id склада',
      );
    }
  }
}
