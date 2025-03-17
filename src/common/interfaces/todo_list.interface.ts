import { BaseInterface } from './base.interface';
import { TodoItem } from './todo_item.interface';

export interface TodoList extends BaseInterface {
  name: string;
  items: TodoItem[];
  source_id?: string;
}
