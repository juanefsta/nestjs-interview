import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseId } from './id.interface';
export abstract class BaseController<T extends BaseId, C, U> {
  constructor(protected readonly service: BaseService<T, C, U>) { }

  @Get()
  index(): T[] {
    return this.service.all();
  }

  @Get('/:id')
  show(@Param('id') id: number): T {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: C): T {
    return this.service.create(dto);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: U): T {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): void {
    this.service.delete(id);
  }
}
