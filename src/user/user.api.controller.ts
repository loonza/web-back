import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { user_role_enum } from '@prisma/client';
import { Roles } from 'src/auth/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('api/user')
export class UserApiController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get(':username')
  @ApiBearerAuth()
  @Roles(user_role_enum.owner)
  @ApiOperation({ summary: 'Получить пользователя по Username' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiParam({ name: 'username', type: String })
  async findOne(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Get('')
  @ApiBearerAuth()
  @Roles(user_role_enum.owner)
  @ApiOperation({ summary: 'Получить всех пользователей (только для админа)' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  async findAll() {
    return this.userService.findAllUsers();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, description: 'Пароль обновлен' })
  @ApiResponse({ status: 404, description: 'Неверный id пользователя' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 204, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Неверный id пользователя' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userService.removeById(id);
  }
}
