import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('api/user')
export class UserApiController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201 })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'username', type: String })
  async findOne(@Param('username') id: string) {
    return this.userService.findByUsername(id);
  }

  @Get('')
  @ApiOperation({ summary: 'Получить всех пользователей' })
  findAll() {
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
