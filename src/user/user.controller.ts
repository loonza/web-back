import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Render,
  Req,
  Sse,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { fromEvent, map, Observable } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

import { Roles } from '../auth/public.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { CreateUserDto } from './dto/create-user.dto';

@ApiExcludeController()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('register')
  @Render('register')
  getRegisterPage(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { title: 'Регистрация', user: req.session.user || null };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @Roles('tenant', 'owner')
  @Render('profile')
  getProfile(@Req() req: Request) {
    if (!req.session.user) {
      return { title: 'Профиль', user: null };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { title: 'Профиль', user: req.session.user };
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { email, password } = body;

    const result = await EmailPassword.signUp('public', email, password);

    if (result.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      return res.status(400).render('register', {
        error: 'Email уже зарегистрирован',
      });
    }

    const createUserDto: CreateUserDto = {
      id: result.user.id,
      username: email.split('@')[0],
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: 'tenant',
    };

    await this.userService.create(createUserDto);

    await Session.createNewSession(req, res, 'public', result.recipeUserId, {
      email,
      username: email.split('@'[0]),
      password,
    });

    return res.redirect('/login');
  }

  @Sse('events')
  @OnEvent('user-created')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'user-created').pipe(
      map((user) => new MessageEvent('user-created', { data: user })),
    );
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { email, password } = req.body;
    const tenantId = 'public';

    try {
      const signInResult = await EmailPassword.signIn(
        tenantId,
        email,
        password,
      );

      if (signInResult.status !== 'OK') {
        return res.status(401).render('login', {
          error: 'Неверные данные',
        });
      }

      await Session.createNewSession(
        req,
        res,
        tenantId,
        signInResult.recipeUserId,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userInDb = await this.userService.findByEmail(email);
      if (!userInDb) {
        return res
          .status(401)
          .render('login', { error: 'Пользователя не существует' });
      }

      req.session.user = {
        id: userInDb.id,
        username: userInDb.username,
        email: userInDb.email,
        password: userInDb.password,
        role: userInDb.role,
      };

      return res.redirect('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.message === 'WRONG_CREDENTIALS_ERROR' ||
        err.type === 'WRONG_CREDENTIALS_ERROR'
      ) {
        return res
          .status(401)
          .render('login', { error: 'Неверный логин или пароль' });
      }

      return res.status(404).render('login', {
        error: 'Внутренняя ошибка сервера',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: err.message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        stack: err.stack,
      });
    }
  }

  @Post('update-password')
  async updatePassword(
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) return res.redirect('/login');
    await this.userService.updatePassword(req.session.user.id, dto);
    res.redirect('/user/profile');
  }

  @Post('delete')
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) return res.redirect('/login');
    await this.userService.removeById(req.session.user.id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
}
