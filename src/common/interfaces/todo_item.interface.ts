import { BaseInterface } from './base.interface';

export interface TodoItem extends BaseInterface {
  listId: number;
  description: string;
  completed: boolean;
}
