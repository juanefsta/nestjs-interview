import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { BaseService } from 'src/common/base.service';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class TodoListsService extends BaseService<TodoList, CreateTodoListDto, UpdateTodoListDto> {

  constructor(protected readonly syncService: QueueService<TodoList>) {
    super(syncService);
  }
}
