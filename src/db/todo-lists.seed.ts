import { TodoListsService } from '../todo_lists/todo_lists.service';

export async function seedTodoLists(todoListsService: TodoListsService) {
  console.log('🔹 Seeding TodoLists ...');

  await todoListsService.create({ name: 'First List', items: [] });
  // await todoListsService.create({ name: 'Second List', items: [] });
  // await todoListsService.create({ name: 'Third List', items: [] });

  console.log('✅ TodoLists seeded.');
}
