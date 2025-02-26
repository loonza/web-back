import { Controller, Get, Query, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  // При открытии сайта проверяем сессию, если нет user — показываем auth.hbs
  @Get('/')
  checkAuth(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.render('auth', { title: 'Авторизация' });
    } else {
      return res.redirect('/index');
    }
  }

  // Рендерим auth.hbs по прямой ссылке /auth
  @Get('/auth')
  @Render('auth')
  getAuthPage() {
    return { title: 'Авторизация' };
  }

  // Обрабатываем вход пользователя
  @Get('/login')
  login(
    @Query('user') user: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (user) {
      req.session.user = { name: user, authorized: true }; // Сохраняем user в сессии
      return res.redirect('/home'); // Редирект на главную после входа
    } else {
      return res.redirect('/auth'); // Если пустое поле, остаёмся на странице авторизации
    }
  }
  @Get('/index')
  @Render('index')
  getHome(@Req() req: Request) {
    return {
      title: 'Главная страница',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }
  @Get('/about')
  @Render('about')
  getAboutPage(@Req() req: Request) {
    return {
      title: 'О нас',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }

  // Страница "Услуги"
  @Get('/services')
  @Render('services')
  getServicesPage(@Req() req: Request) {
    return {
      title: 'Услуги',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }

  // Страница "Контакты"
  @Get('/contact')
  @Render('contact')
  getContactPage(@Req() req: Request) {
    return {
      title: 'Контакты',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }

  // Страница "Отзывы"
  @Get('/reviews')
  @Render('reviews')
  getReviewsPage(@Req() req: Request) {
    return {
      title: 'Отзывы',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }

  // Страница "Добавить услугу"
  @Get('/service-info')
  @Render('service-info')
  getServiceInfoPage(@Req() req: Request) {
    return {
      title: 'Добавить услугу',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user ? req.session.user : null,
    };
  }

  // Выход из аккаунта (очистка сессии)
  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    req.session.destroy(() => {
      res.redirect('/auth'); // После выхода редирект на авторизацию
    });
  }
}
