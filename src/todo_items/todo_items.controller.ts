import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { TodoItem } from 'src/common/interfaces/todo_item.interface';

@Controller('api/todoLists/:listId/todoItems')
export class TodoItemsController {
  constructor(private todoItemService: TodoItemsService) { }

  @Get()
  index(@Param('listId') listId: number): TodoItem[] {
    return this.todoItemService.findAllByKeyId(listId);
  }

  @Get()
  show(@Param('id') id: number): TodoItem {
    return this.todoItemService.get(id);
  }

  @Post()
  create(@Param('listId') listId: number, @Body() createTodoItemDto: CreateTodoItemDto): TodoItem {
    const dto: CreateTodoItemDto = { ...createTodoItemDto, listId, completed: false };
    return this.todoItemService.create(dto);
  }

  @Put('/:todoItemId')
  update(@Param('todoItemId') todoItemId: number, @Body() updateTodoItemDto: UpdateTodoItemDto): TodoItem {
    return this.todoItemService.update(todoItemId, updateTodoItemDto);
  }

  @Delete('/:todoItemId')
  delete(@Param('todoItemId') todoItemId: number): void {
    this.todoItemService.delete(todoItemId);
  }
}
