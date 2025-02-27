import { Controller, Get, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  @Render('auth')
  getAuthPage() {
    return { title: 'Авторизация', isAuthPage: true };
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

  @Get('/service-info')
  @Render('service-info')
  getServiceInfoPage() {
    return { title: 'Добавить услугу' };
  }

  @Get('/reviews')
  @Render('reviews')
  getReviewsPage() {
    return { title: 'Отзывы' };
  }
}
