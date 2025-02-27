import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  getHomePage() {
    return { title: 'Главная' };
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
