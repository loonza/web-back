import { Controller, Get, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  getLoginPage() {
    return {};
  }

  @Get('/login')
  login(@Query('user') user: string, @Res() res: Response) {
    if (user) {
      res.redirect(`/inex?user=${encodeURIComponent(user)}`);
    } else {
      res.redirect('/');
    }
  }

  @Get('/index')
  @Render('index') // Главная после входа
  getHome(@Query('user') user: string) {
    return { title: 'Главная страница', user: user ? { name: user } : null };
  }

  @Get('/about')
  @Render('about')
  getAnimals(@Query('user') user: string) {
    return { title: 'О нас', user: user ? { name: user } : null };
  }

  @Get('/services')
  @Render('services')
  getServices(@Query('user') user: string) {
    return { title: 'Услуги', user: user ? { name: user } : null };
  }

  @Get('/contacts')
  @Render('contacts')
  getContacts(@Query('user') user: string) {
    return { title: 'Контакты', user: user ? { name: user } : null };
  }
  @Get('/logout')
  logout(@Res() res: Response) {
    res.redirect('/');
  }
}
