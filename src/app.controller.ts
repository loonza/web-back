import { Controller, Get, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  @Render('auth')
  getLoginPage() {
    return { title: 'Авторизация' };
  }

  @Get('/login')
  login(@Query('user') user: string, @Res() res: Response) {
    if (user) {
      res.redirect(`/home?user=${encodeURIComponent(user)}`);
    } else {
      res.redirect('/');
    }
  }

  @Get('/home')
  @Render('index')
  getHome(@Query('user') user: string) {
    return { title: 'Главная страница', user: user ? { name: user } : null };
  }

  @Get('/about')
  @Render('about')
  getAbout(@Query('user') user: string) {
    return { title: 'О нас', user: user ? { name: user } : null };
  }

  @Get('/services')
  @Render('services')
  getServices(@Query('user') user: string) {
    return { title: 'Услуги', user: user ? { name: user } : null };
  }

  @Get('/contact')
  @Render('contact')
  getContact(@Query('user') user: string) {
    return { title: 'Контакты', user: user ? { name: user } : null };
  }

  @Get('/reviews')
  @Render('reviews')
  getReviews(@Query('user') user: string) {
    return { title: 'Отзывы', user: user ? { name: user } : null };
  }

  @Get('/service-info')
  @Render('service-info')
  getServiceInfo(@Query('user') user: string) {
    return { title: 'Добавить услугу', user: user ? { name: user } : null };
  }

  @Get('/logout')
  logout(@Res() res: Response) {
    res.redirect('/');
  }
}