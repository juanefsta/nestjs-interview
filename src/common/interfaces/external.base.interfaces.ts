import { TodoItem } from './todo_item.interface';
import { TodoList } from './todo_list.interface';

export interface ExternalTodoList extends TodoList {
  source_id?: string;
}

export interface ExternalTodoItem extends TodoItem {
  source_id?: string;
}
