import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list.dto';
import { UpdateTodoListDto } from './dtos/update-todo_list.dto';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { BaseService } from 'src/common/base.service';
import { QueueService } from 'src/queue/queue.service';
import { TodoItemsService } from 'src/todo_items/todo_items.service';

type OperationType = 'create' | 'update' | 'delete';
@Injectable()
export class TodoListsService extends BaseService<TodoList, CreateTodoListDto, UpdateTodoListDto> {

  constructor(protected readonly queueService: QueueService<TodoList>, protected readonly todoItemsService: TodoItemsService) {
    super(queueService, 'TodoList');
  }

  all(): TodoList[] {
    return this.items.map((todoList: TodoList) => {
      this.logger.log(`Fetching all ${this.entityName}`)
      const items = this.todoItemsService.findAllByKeyId(todoList.id);
      todoList.items = items;
      return todoList;
    });
  }

  get(id: number): TodoList {
    this.logger.log(`Fetching ${this.entityName} with ID: ${id}`);
    const todoList = this.items.find((x: any) => Number(x.id) === Number(id));
    if (todoList) {
      const items = this.todoItemsService.findAllByKeyId(todoList.id);
      todoList.items = items;
    }
    return todoList;
  }


  delete(id: number, disableSync?: boolean): void {
    const index = this.items.findIndex((x: any) => Number(x.id) === Number(id));
    if (index > -1) {
      const deletedItem = this.items[index];
      const itemsToDelete = this.todoItemsService.findAllByKeyId(deletedItem.id);
      itemsToDelete.forEach((item) => {
        this.todoItemsService.delete(item.id);
      });
      this.items.splice(index, 1);

      this.logger.log(`Updated ${this.entityName} with ID: ${id}`);
      if (!disableSync) {
        this.syncTodoList(deletedItem, 'delete');
      }
    }
    this.logger.error(`${this.entityName} with ID ${id} not found for update`);
    throw new Error(`${this.entityName} with ID ${id} not found for update`);
  }

  syncTodoList(todoList: TodoList, operation: OperationType): void {
    switch (operation) {
      case 'create':
        this.queueService.syncCreate(todoList, this.entityName);
        break;
      case 'update':
        this.queueService.syncUpdate(todoList, this.entityName);
        break;
      case 'delete':
        this.queueService.syncDelete(todoList, this.entityName);
        break;
    }
  }
}
