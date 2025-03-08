import { TodoListsService } from '../todo_lists/todo_lists.service';
import { seedTodoLists } from './todo-lists.seed';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function seed(app: NestExpressApplication) {

  try {
    const todoListsService = app.get(TodoListsService);
    
    // Excecute all seeds
    await seedTodoLists(todoListsService);
    
    console.log('🌱 Succesfully seeded.');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
  } finally {
    await app.close();
  }
}
