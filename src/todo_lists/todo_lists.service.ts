import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { BaseService } from 'src/common/base.service';
import { QueueService } from 'src/queue/queue.service';
import { TodoItemsService } from 'src/todo_items/todo_items.service';

@Injectable()
export class TodoListsService extends BaseService<TodoList, CreateTodoListDto, UpdateTodoListDto> {

  constructor(protected readonly syncService: QueueService<TodoList>, protected readonly todoItemsService: TodoItemsService) {
    super(syncService, 'TodoList');
  }

  all(): TodoList[] {
    return this.items.map((todoList: TodoList) => {
      const items = this.todoItemsService.findAllByKeyId(todoList.id);
      todoList.items = items;
      return todoList;
    });
  }

  get(id: number): TodoList {
    const todoList = this.items.find((x: any) => Number(x.id) === Number(id));
    if (todoList) {
      const items = this.todoItemsService.findAllByKeyId(todoList.id);
      todoList.items = items;
    }
    return todoList;
  }


  delete(id: number): void {
    const index = this.items.findIndex((x: any) => Number(x.id) === Number(id));
    if (index > -1) {
      const deletedItem = this.items[index];

      const itemsToDelete = this.todoItemsService.findAllByKeyId(deletedItem.id);
      itemsToDelete.forEach((item) => {
        this.todoItemsService.delete(item.id);
      });

      this.items.splice(index, 1);
      this.syncService.syncDelete(deletedItem.id, this.entityName);
    }
  }
}
