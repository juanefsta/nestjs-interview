import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoListsController } from '../todo_lists/todo_lists.controller';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { CreateTodoListDto } from '../todo_lists/dtos/create-todo_list.dto';
import { QueueService } from '../queue/queue.service';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { TodoItem } from '../common/interfaces/todo_item.interface';
import { TodoItemsService } from '../todo_items/todo_items.service';

describe('TodoListsController', () => {
  let controller: TodoListsController;
  let service: TodoListsService;
  let queueService: QueueService<TodoList>;
  let todoItemService: TodoItemsService;

  const mockTodoItemList: TodoItem[] = [{ id: 1, description: 'Test Item', completed: false, created_at: new Date(), updated_at: new Date(), listId: 1 }];

  const mockTodoList = [{ id: 1, name: 'Test List', items: mockTodoItemList }, { id: 2, name: 'Test List 2', items: [] }];

  const mockTodoListsService = {
    all: jest.fn(() => mockTodoList),
    get: jest.fn((id) => (id === 1 ? mockTodoList[id] : null)),
    create: jest.fn((dto) => ({ id: 2, ...dto })),
    delete: jest.fn((id) => {
      if (id !== 1) throw new NotFoundException(`Item with ID ${id} not found`);
    }),
  };

  const mockQueueService = {
    syncCreate: jest.fn(),
    syncDelete: jest.fn(),
    syncUpdatete: jest.fn(),
  };

  const mockTodoItemsService = {
    findAllByKeyId: jest.fn((id: number) => mockTodoItemList.filter((x) => Number(x.listId) === Number(id))),
    delete: jest.fn((id) => {
      if (id !== 1) throw new NotFoundException(`Item with ID ${id} not found`);
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: mockTodoListsService }, { provide: QueueService, useValue: mockQueueService }, { provide: TodoItemsService, useValue: mockTodoItemsService }],
    }).compile();

    controller = module.get<TodoListsController>(TodoListsController);
    service = module.get<TodoListsService>(TodoListsService);
    todoItemService = module.get<TodoItemsService>(TodoItemsService);
    queueService = module.get<QueueService<TodoList>>(QueueService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return all todo lists', () => {
      expect(controller.index()).toEqual(mockTodoList);
      expect(service.all).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should return a todo list by ID', () => {
      const id = 1;
      expect(controller.show(id)).toEqual(mockTodoList[id]);
      expect(service.get).toHaveBeenCalledWith(1);
      expect(service.get).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if not found', () => {
      jest.spyOn(service, 'get').mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.show(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todo list', () => {
      const dto: CreateTodoListDto = { name: 'New List', items: [] };
      expect(controller.create(dto)).toEqual({ id: 2, name: 'New List', items: [] });
      expect(service.create).toHaveBeenCalledWith({ ...dto, items: [] });
    });

    it('should create a new todo list and sync by default', () => {
      const dto: CreateTodoListDto = { name: 'New List', items: [] };
      const createdTodoList = {
        id: 2,
        name: 'New List',
        items: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'create').mockImplementation((dto) => {
        const now = new Date();
        const newItem = { id: 2, ...dto, created_at: now, updated_at: now };
        queueService.syncCreate(newItem, 'TodoList');
        return newItem;
      });

      jest.spyOn(queueService, 'syncCreate');

      expect(controller.create(dto)).toEqual(createdTodoList);
      expect(service.create).toHaveBeenCalledWith({ ...dto, items: [] });
      expect(queueService.syncCreate).toHaveBeenCalledWith(createdTodoList, 'TodoList');
    });

    it('should create a new todo list without syncing if disableSync is true', () => {
      const dto: CreateTodoListDto = { name: 'New List', items: [] };
      const createdTodoList = { id: 2, name: 'New List', items: [], created_at: expect.any(Date), updated_at: expect.any(Date) };

      jest.spyOn(service, 'create').mockReturnValue(createdTodoList);
      jest.spyOn(queueService, 'syncCreate');

      const result = service.create(dto, true);

      expect(result).toEqual(createdTodoList);
      expect(service.create).toHaveBeenCalledWith(dto, true);
      expect(queueService.syncCreate).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a todo list and sync by default', () => {
      const id = 1;
      jest.spyOn(service, 'delete').mockImplementation(() => {
        const index = mockTodoList.findIndex((x: TodoList) => Number(x.id) === Number(id));
        if (index > -1) {
          const deletedItem = { ...mockTodoList[index], updated_at: new Date(), created_at: new Date() };
          const itemsToDelete = todoItemService.findAllByKeyId(deletedItem.id);;
          itemsToDelete.forEach((item) => {
            todoItemService.delete(item.id);
          });
          mockTodoList.splice(index, 1);
          queueService.syncDelete(deletedItem, 'TodoList');
        }

      });
      jest.spyOn(queueService, 'syncDelete');

      expect(() => controller.delete(id)).not.toThrow();
      expect(service.delete).toHaveBeenCalledWith(id);
      expect(todoItemService.delete).toHaveBeenCalled();
      expect(todoItemService.findAllByKeyId).toHaveBeenCalledWith(id);
      expect(queueService.syncDelete).toHaveBeenCalled();
    });

    it('should throw an error if the todo list is not found', () => {
      jest.spyOn(service, 'delete').mockImplementation(() => {
        throw new NotFoundException(`TodoList with ID not found`);
      });

      expect(() => controller.delete(999)).toThrow(NotFoundException);
    });
  });

});
