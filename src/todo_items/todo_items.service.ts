import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { BaseService } from 'src/common/base.service';
import { TodoItem } from 'src/common/interfaces/todo_item.interface';
import { QueueService } from 'src/queue/queue.service';
import { TodoListsService } from 'src/todo_lists/todo_lists.service';

@Injectable()
export class TodoItemsService extends BaseService<TodoItem, CreateTodoItemDto, UpdateTodoItemDto> {

  constructor(protected readonly syncService: QueueService<TodoItem>, protected readonly todoListService: TodoListsService) {
    super(syncService, 'TodoItem');
  }

  create(dto: CreateTodoItemDto, disableSync?: boolean): TodoItem {
    const itemCreated = super.create(dto, disableSync);
    const updatedList = this.todoListService.get(itemCreated.listId);
    this.todoListService.syncTodoList(updatedList, 'update');

    return itemCreated;
  }

  findAllByKeyId(listId: number): TodoItem[] {
    return this.items.filter((item: TodoItem) => Number(item.listId) === Number(listId));
  }
}
