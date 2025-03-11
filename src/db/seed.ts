import { TodoItemsService } from 'src/todo_items/todo_items.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { seedTodoItems } from './todo-items.seed';
import { seedTodoLists } from './todo-lists.seed';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function seed(app: NestExpressApplication) {

  try {
    const todoListsService = app.get(TodoListsService);
    const todoItemsService = app.get(TodoItemsService);

    // Excecute all seeds
    await Promise.all([
      seedTodoLists(todoListsService),
      seedTodoItems(todoItemsService),
    ]);


    console.log('🌱 Succesfully seeded.');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
  }
}
