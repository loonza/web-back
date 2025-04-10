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
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('warehouse')
@Controller('api/warehouse')
export class WarehouseApiController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('search')
  @ApiOperation({ summary: 'Получить все склады с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список складов получен' })
  async findAll(
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
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
    return warehouse;
  }

  @Post('create')
  @ApiOperation({ summary: 'Создать новый склад' })
  @ApiBody({ type: CreateWarehouseDto })
  @ApiResponse({ status: 201, description: 'Склад создан' })
  async create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удалить склад' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Склад удалён' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async remove(@Param('id') id: string) {
    const result = await this.warehouseService.remove(id);
    if (!result) throw new NotFoundException('Склад не найден');
    return { message: 'Склад успешно удален' };
  }
}
