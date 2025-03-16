import { TodoItem } from '../../common/interfaces/todo_item.interface';

export class CreateExternalTodoItemDto {
  source_id: number;
  name: string;
  items: TodoItem[];
}
