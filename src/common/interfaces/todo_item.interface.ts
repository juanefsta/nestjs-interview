import { BaseId } from "src/common/id.interface";

export interface TodoItem extends BaseId {
    listId: number;
    description: string;
    completed: boolean;
}
