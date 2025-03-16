export class UpdateTodoItemDto {
  description: string;
  completed: boolean;
  //Only For Seed
  listId?: number;
  updated_at?: Date;
}
