import { Controller, Get, Render, Query, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  checkAuth(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.render('auth', { title: 'Авторизация' });
    }
    return res.redirect('/home');
  }

  @Get('/login')
  login(@Query('user') user: string, @Req() req: Request, @Res() res: Response) {
    if (user) {
      req.session.user = { name: user, authorized: true };
      res.redirect('/home');
    } else {
      res.redirect('/');
    }
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }

  @Get('/home')
  @Render('index')
  getHome(@Req() req: Request) {
    if (!req.session.user) {
      return { redirect: '/' };
    }
    return { title: 'Главная страница', user: req.session.user };
  }

  @Get('/about')
  @Render('about')
  getAboutPage(@Req() req: Request) {
    if (!req.session.user) return { redirect: '/' };
    return { title: 'О нас' };
  }

  @Get('/services')
  @Render('services')
  getServicesPage(@Req() req: Request) {
    if (!req.session.user) return { redirect: '/' };
    return { title: 'Услуги' };
  }

  @Get('/contact')
  @Render('contact')
  getContactPage(@Req() req: Request) {
    if (!req.session.user) return { redirect: '/' };
    return { title: 'Контакты' };
  }

  @Get('/reviews')
  @Render('reviews')
  getReviewsPage(@Req() req: Request) {
    if (!req.session.user) return { redirect: '/' };
    return { title: 'Отзывы' };
  }

  @Get('/service-info')
  @Render('service-info')
  getServiceInfoPage(@Req() req: Request) {
    if (!req.session.user) return { redirect: '/' };
    return { title: 'Добавить услугу' };
  }
}
