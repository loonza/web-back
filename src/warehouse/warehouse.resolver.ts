import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [Warehouse], { name: 'warehouse' })
  async viewAllWarehouses() {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse, { name: 'searchWarehouses' })
  async findWarehouseById(
    @Args('location', { type: () => String }) location: string,
  ) {
    const warehouses = await this.warehouseService.search(location);
    if (!warehouses || warehouses.length === 0) {
      throw new NotFoundException('Склады с такой локацией не найдены');
    }
    return warehouses;
  }

  @Mutation(() => Warehouse)
  async addWarehouse(
    @Args('createWarehouseInput') CreateWarehouseInput: CreateWarehouseInput,
  ) {
    return this.warehouseService.create(
      CreateWarehouseInput as CreateWarehouseDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteWarehouse(@Args('id', { type: () => String }) id: string) {
    const existing = await this.warehouseService.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Склад с ID ${id} не найден`);
    }
    await this.warehouseService.remove(id);
    return true;
  }
}
