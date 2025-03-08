import { BaseInterface } from "src/common/base.interface";
import { TodoItem } from "./todo_item.interface";

export interface TodoList extends BaseInterface {
    items: TodoItem[];
}
