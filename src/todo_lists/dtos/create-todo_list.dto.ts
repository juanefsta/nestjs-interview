import { TodoItem } from "src/interfaces/todo_item.interface";

export class CreateTodoListDto {
  name: string;
  items: TodoItem[];
}
