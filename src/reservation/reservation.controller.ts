import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create')
  async create(
    @Req() req: Request,
    @Body() dto: CreateReservationDto,
    @Res() res: Response,
  ) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    await this.reservationService.create(req.session.user.id, dto);
    res.redirect('/warehouse');
  }

  @Get('')
  async getUserReservations(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const reservations = await this.reservationService.findAll(
      req.session.user.id,
    );
    res.render('reservation', { reservations, user: req.session.user });
  }

  @Post(':id/delete')
  async remove(
    @Param('id') id: string,
    @Body() id_delete,
    @Res() res: Response,
  ) {
    id_delete = Number(id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.reservationService.remove(id_delete);
    res.redirect('/reservation');
  }
}
