import { Logger } from '@nestjs/common';
import { TodoListsService } from '../todo_lists/todo_lists.service';

export async function seedTodoLists(todoListsService: TodoListsService) {
  const logger = new Logger('Seed - TodoList');
  const syncDisabled = true;
  logger.log('Seeding Todo Lists...');

  await Promise.all([
    todoListsService.create({ name: 'First List', items: [] }, syncDisabled),
    todoListsService.create({ name: 'Second List', items: [] }, syncDisabled),
    todoListsService.create({ name: 'Third List', items: [] }, syncDisabled),
  ]);
  logger.log('Todo Lists seeding completed successfully.');
}
