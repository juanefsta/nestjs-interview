import { TodoItem } from "src/common/interfaces/todo_item.interface";

export class CreateTodoListDto {
  name: string;
  items: TodoItem[];
}
