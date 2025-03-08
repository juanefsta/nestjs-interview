import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../interfaces/todo_list.interface';
import { nextId } from 'src/common/utils/id.util';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class TodoListsService extends BaseService<TodoList, CreateTodoListDto, UpdateTodoListDto> {
  private readonly todolists: TodoList[];

  constructor() {
    super();
    this.todolists = [];
  }
}
