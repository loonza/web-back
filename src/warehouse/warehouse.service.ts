import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.warehouse.findMany({
      where: search
        ? { location: { contains: search, mode: 'insensitive' } }
        : {},
    });
  }

  async search(location: string) {
    const warehouse = await this.prisma.warehouse.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      },
    });
    if (!warehouse) {
      throw new NotFoundException(`Склад с id ${location} не найден`);
    }
    return warehouse;
  }

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data: dto });
  }

  async remove(id: string) {
    return this.prisma.warehouse.delete({ where: { id } });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.warehouse.findMany({ skip, take: limit }),
      this.prisma.warehouse.count(),
    ]);
    return [data, total];
  }
}
