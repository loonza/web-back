import { Controller, Get, Render, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndexPage(@Query('user') user: string) {
    return { session: user ? { name: user, authorized: true } : { authorized: false }, title: 'Главная' };
  }

  @Get('about')
  @Render('about')
  getAboutPage() {
    return { title: 'О нас' };
  }

  @Get('services')
  @Render('services')
  getServicesPage() {
    return { title: 'Услуги' };
  }

  @Get('contact')
  @Render('contact')
  getContactPage() {
    return { title: 'Контакты' };
  }

  @Get('reviews')
  @Render('reviews')
  getReviewsPage() {
    return { title: 'Отзывы' };
  }

  @Get('service-info')
  @Render('service-info')
  getServiceInfoPage() {
    return { title: 'Добавить услугу' };
  }
}
