import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  Query,
  Sse,
  NotFoundException,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { Request, Response } from 'express';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async findAll(
    @Query('search') search: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(req.session.user);
    const warehouses = await this.warehouseService.findAll(search);
    const user = req.session.user;

    return res.render('warehouse', {
      warehouses,
      user,
      isAdmin: user?.role === 'owner',
      isUser: user?.role == 'tenant',
    });
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'warehouse.created').pipe(
      map((data) => new MessageEvent('warehouse.created', { data })),
    );
  }

  @Get('search')
  async search(
    @Query('location') location: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const warehouses = await this.warehouseService.search(location);
      return res.render('warehouse', {
        warehouses,
        user: req.session.user,
        isAdmin: req.session.user?.role === 'owner',
        isUser: req.session.user?.role == 'tenant',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).render('errors/not-found', {
          message: error.message,
        });
      }
      throw error;
    }
  }

  @Post('create')
  async create(
    @Body() dto: CreateWarehouseDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user || req.session.user.role !== 'owner') {
      return res.status(403).send('Нет доступа');
    }
    dto.capacity = Number(dto.capacity);
    dto.price = Number(dto.price);
    const warehouse = await this.warehouseService.create(dto);
    this.eventEmitter.emit('warehouse-created', warehouse);
    res.status(201).json(warehouse);
  }

  @Post(':id/delete')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.warehouseService.remove(id);
    res.redirect('/warehouse');
  }
}
