import { TodoItemsService } from 'src/todo_items/todo_items.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { seedTodoItems } from './todo-items.seed';
import { seedTodoLists } from './todo-lists.seed';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

export async function seed(app: NestExpressApplication) {
  const logger = new Logger('Seed');

  try {
    logger.log('Starting the seeding process...');

    const todoListsService = app.get(TodoListsService);
    const todoItemsService = app.get(TodoItemsService);

    logger.log('Retrieved services: TodoListsService and TodoItemsService.');

    await seedTodoLists(todoListsService).catch((error) => {
      logger.error(`Seeding Todo Lists failed: ${error.message}`, error.stack);
    });

    await seedTodoItems(todoItemsService).catch((error) => {
      logger.error(`Seeding Todo Items failed: ${error.message}`, error.stack);
    }
    );

    logger.log('Seeding process completed successfully.');
  } catch (error) {
    logger.error(`Seeding process failed: ${error.message}`, error.stack);
  }
}
