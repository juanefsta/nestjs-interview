import { Get, Post, Put, Delete, Param, Body, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseInterface } from './interfaces/base.interface';
export abstract class BaseController<T extends BaseInterface, C, U> {
  constructor(protected readonly service: BaseService<T, C, U>) { }

  @Get()
  index(): T[] {
    try {
      return this.service.all();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching all items');
    }
  }

  @Get('/:id')
  show(@Param('id') id: number): T {
    try {
      return this.service.get(id);
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  @Post()
  create(@Body() dto: C): T {
    try {
      return this.service.create(dto);
    } catch (error) {
      throw new InternalServerErrorException('Error creating new item');
    }
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: U): T {
    try {
      return this.service.update(id, dto);
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found for update`);
    }
  }

  @Delete('/:id')
  delete(@Param('id') id: number): void {
    try {
      this.service.delete(id);
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found for delete`);
    }
  }
}
