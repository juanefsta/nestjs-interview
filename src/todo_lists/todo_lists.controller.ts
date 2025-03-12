import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';
import { BaseController } from 'src/common/base.controller';

@Controller('api/todoLists')
export class TodoListsController extends BaseController<TodoList, CreateTodoListDto, UpdateTodoListDto> {
  constructor(private todoListsService: TodoListsService) {
    super(todoListsService);
  }

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:id')
  show(@Param('id') id: number): TodoList {
    return this.todoListsService.get(id);
  }

  @Post()
  create(@Body() createTodoListDto: CreateTodoListDto): TodoList {
    const dto = { ...createTodoListDto, items: [] };
    return this.todoListsService.create(dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): void {
    this.todoListsService.delete(id);
  }
}
