import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsService } from './todo_items.service';

describe('TodoItemsService', () => {
  let service: TodoItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoItemsService],
    }).compile();

    service = module.get<TodoItemsService>(TodoItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
