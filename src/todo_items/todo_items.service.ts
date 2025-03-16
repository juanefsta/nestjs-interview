import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { BaseService } from '../common/base.service';
import { TodoItem } from '../common/interfaces/todo_item.interface';
import { QueueService } from '../queue/queue.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';

@Injectable()
export class TodoItemsService extends BaseService<TodoItem, CreateTodoItemDto, UpdateTodoItemDto> {

  constructor(protected readonly queueService: QueueService<TodoItem>, @Inject(forwardRef(() => TodoListsService)) protected readonly todoListService: TodoListsService) {
    super(queueService, 'TodoItem');
  }

  create(dto: CreateTodoItemDto, syncDisabled?: boolean): TodoItem {
    const createdItem = super.create(dto, true);

    const updatedList = this.todoListService.update(createdItem.listId, { updated_at: new Date() }, true);

    if (!syncDisabled) {
      this.todoListService.syncTodoList(updatedList, 'update');
    }
    return createdItem;
  }

  update(id: number, dto: UpdateTodoItemDto, syncDisabled?: boolean): TodoItem {
    const updatedItem = super.update(id, dto, true);

    const updatedList = this.todoListService.update(updatedItem.listId, { updated_at: new Date() }, true);
    if (!syncDisabled) {
      this.todoListService.syncTodoList(updatedList, 'update');
    }
    return updatedItem;
  }

  delete(id: number, syncDisabled?: boolean): void {
    super.delete(id, true);
    const updatedList = this.todoListService.get(id);

    if (!syncDisabled) {
      this.todoListService.syncTodoList(updatedList, 'update');
    }
  }

  findAllByKeyId(listId: number): TodoItem[] {
    return this.items.filter((item: TodoItem) => Number(item.listId) === Number(listId));
  }
}
