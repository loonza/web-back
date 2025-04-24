import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new Error('Пользователь с таким именем уже существует');
    }
    return this.prisma.user.create({
      data: {
        id: createUserDto.id,
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        role: 'tenant',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async validateUser(id: string, username: string, password: string) {
    const user = await this.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async updatePassword(id: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { password: dto.password },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException(
        'Неверный ID пользователя — обновление невозможно',
      );
    }
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async removeById(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException(
        'Неверный ID пользователя — удаление невозможно',
      );
    }
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take: limit }),
      this.prisma.user.count(),
    ]);
    return [data, total];
  }
}
