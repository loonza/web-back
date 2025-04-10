import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request, Response } from 'express';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('')
  async getReview(@Req() req: Request, @Res() res: Response) {
    const reviews = await this.reviewService.findAll();
    const user = req.session.user;

    res.render('review', {
      reviews,
      user,
      isAdmin: user?.role === 'owner',
      isUser: user?.role == 'tenant',
    });
  }

  @Post('create')
  async create(
    @Body() dto: CreateReviewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) return res.redirect('/login');
    await this.reviewService.create(req.session.user.id, dto);
    res.redirect('/review');
  }

  @Post(':id/delete')
  async delete(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) return res.redirect('/login');
    await this.reviewService.remove(Number(id));
    res.redirect('/review');
  }
}
