import { TodoListsService } from '../todo_lists/todo_lists.service';

export async function seedTodoLists(todoListsService: TodoListsService) {
  console.log('🔹 Seeding TodoLists ...');

  await todoListsService.create({ name: 'First List' });
  await todoListsService.create({ name: 'Second List' });
  await todoListsService.create({ name: 'Third List' });

  console.log('✅ TodoLists seeded.');
}
