import { TodoItemsService } from '../todo_items/todo_items.service';

export async function seedTodoItems(todoItemsService: TodoItemsService) {
  console.log('🔹 Seeding TodoItems ...');

  await todoItemsService.create({ description: 'First Item', listId: 1, completed: false });
  await todoItemsService.create({ description: 'Second Item', listId: 1, completed: false });
  await todoItemsService.create({ description: 'Third Item', listId: 1, completed: false });
  await todoItemsService.create({ description: 'Fourth Item', listId: 2, completed: false });
  await todoItemsService.create({ description: 'Fifth Item', listId: 2, completed: false });

  console.log('✅ TodoItems seeded.');
}
