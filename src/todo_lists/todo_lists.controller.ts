import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../interfaces/todo_list.interface';
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

  @Get('/:todoListId')
  show(@Param('todoListId') todoListId: number): TodoList {
    return this.todoListsService.get(todoListId);
  }

  @Post()
  create(@Body() createTodoListDto: CreateTodoListDto): TodoList {
    const dto = { ...createTodoListDto, items: [] };
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  update(
    @Param('todoListId') todoListId: number,
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    return this.todoListsService.update(todoListId, dto);
  }

  @Delete('/:todoListId')
  delete(@Param('todoListId') todoListId: number): void {
    this.todoListsService.delete(todoListId);
  }
}
