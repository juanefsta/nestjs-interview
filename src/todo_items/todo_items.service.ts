import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { BaseService } from 'src/common/base.service';
import { TodoItem } from 'src/common/interfaces/todo_item.interface';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class TodoItemsService extends BaseService<TodoItem, CreateTodoItemDto, UpdateTodoItemDto> {

  constructor(protected readonly syncService: QueueService<TodoItem>) {
    super(syncService, 'TodoItem');
  }

  findAllByKeyId(listId: number): TodoItem[] {
    return this.items.filter((item: TodoItem) => Number(item.listId) === Number(listId));
  }
}
