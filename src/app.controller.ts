import { Controller, Get, Render, Query, Res } from '@nestjs/common';
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
    return { title: 'Главная страница', session: user ? { name: user, authorized: true } : { authorized: false } };
  }

  @Get('/about')
  @Render('about')
  getAboutPage() {
    return { title: 'О нас' };
  }

  @Get('/services')
  @Render('services')
  getServicesPage() {
    return { title: 'Услуги' };
  }

  @Get('/contact')
  @Render('contact')
  getContactPage() {
    return { title: 'Контакты' };
  }

  @Get('/reviews')
  @Render('reviews')
  getReviewsPage() {
    return { title: 'Отзывы' };
  }

  @Get('/service-info')
  @Render('service-info')
  getServiceInfoPage() {
    return { title: 'Добавить услугу' };
  }
}
