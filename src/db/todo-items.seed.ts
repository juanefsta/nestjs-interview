import { Logger } from '@nestjs/common';
import { TodoItemsService } from '../todo_items/todo_items.service';

export async function seedTodoItems(todoItemsService: TodoItemsService) {
  const logger = new Logger('Seed - TodoItem');
  const syncDisabled = false;

  logger.log('Seeding Todo Items...');

  await Promise.all([
    todoItemsService.create(
      { description: 'First Item', listId: 1, completed: false },
      syncDisabled,
    ),
    todoItemsService.create(
      { description: 'Second Item', listId: 1, completed: false },
      syncDisabled,
    ),
    ,
    todoItemsService.create(
      { description: 'Third Item', listId: 1, completed: false },
      syncDisabled,
    ),
    todoItemsService.create(
      { description: 'Fourth Item', listId: 2, completed: false },
      syncDisabled,
    ),
    ,
    todoItemsService.create(
      { description: 'Fifth Item', listId: 2, completed: false },
      syncDisabled,
    ),
  ]);

  logger.log('Todo Items seeding completed successfully.');
}
