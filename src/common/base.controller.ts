import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

export abstract class BaseController<T, C, U> {
  constructor(protected readonly service: any) { }

  @Get()
  index(): T[] {
    return this.service.all();
  }

  @Get('/:id')
  show(@Param('id') id: number): T {
    return this.service.get(id);
  }

  @Post()
  create?(@Body() dto: C): T {
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
