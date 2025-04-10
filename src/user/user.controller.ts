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
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { fromEvent, map, Observable } from 'rxjs';

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
  @Render('profile')
  getProfile(@Req() req: Request) {
    if (!req.session.user) {
      return { title: 'Профиль', user: null };
    }
    return { title: 'Профиль', user: req.session.user };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.create(dto);
      this.eventEmitter.emit('user-created', user); // emit событие
      res.redirect('/login');
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  @Sse('events')
  @OnEvent('user-created')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'user-created').pipe(
      map((user) => new MessageEvent('user-created', { data: user })),
    );
  }

  @Post('login')
  async login(
    @Body()
    body: {
      id: string;
      username: string;
      password: string;
    },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = await this.userService.validateUser(
      body.id,
      body.username,
      body.password,
    );
    if (user) {
      req.session.user = {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
      };
      res.redirect('/');
    } else {
      res.status(401).send('Неверные данные');
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
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
}
