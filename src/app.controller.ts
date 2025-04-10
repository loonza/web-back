import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  getHome(@Req() req: Request) {
    return { title: 'Главная страница', user: req.session.user || null };
  }

  @Get('/login')
  @Render('login') // или как ты назвал шаблон
  getLoginForm(@Req() req: Request) {
    return { title: 'Вход', user: req.session.user || null };
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }

  @Get('/about')
  @Render('about')
  getAboutPage(@Req() req: Request) {
    return { title: 'О нас', user: req.session.user || null };
  }

  @Get('/services')
  @Render('services')
  getServicesPage(@Req() req: Request) {
    return { title: 'Услуги', user: req.session.user || null };
  }

  @Get('/contact')
  @Render('contact')
  getContactPage(@Req() req: Request) {
    return { title: 'Контакты', user: req.session.user || null };
  }

  @Get('/service-info')
  @Render('service-info')
  getServiceInfoPage(@Req() req: Request) {
    return { title: 'Добавить услугу', user: req.session.user || null };
  }

  @Get('/reviews')
  @Render('reviews')
  getReviewsPage(@Req() req: Request) {
    return { title: 'Отзывы', user: req.session.user || null };
  }
  @Get('/reservations')
  @Render('reservations')
  getReservationPage(@Req() req: Request) {
    return { title: 'Мои брони', user: req.session.user || null };
  }
}
