import { NotFoundException } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';

const mockTodoItem = { id: 1, listId: 1, name: 'Test Item', completed: false };

const mockTodoItemService = {
  findAllByKeyId: jest.fn().mockReturnValue([mockTodoItem]),
  get: jest.fn().mockImplementation((id) => {
    if (id === mockTodoItem.id) return mockTodoItem;
    throw new NotFoundException(`TodoItem with ID ${id} not found`);
  }),
  create: jest.fn().mockImplementation((dto) => ({ id: 2, ...dto })),
  update: jest.fn().mockImplementation((id, dto) => {
    if (id !== mockTodoItem.id) throw new NotFoundException();
    return { ...mockTodoItem, ...dto };
  }),
  delete: jest.fn().mockImplementation((id) => {
    if (id !== mockTodoItem.id) throw new NotFoundException();
  }),
};

describe('TodoItemsController', () => {
  let controller: TodoItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [{ provide: TodoItemsService, useValue: mockTodoItemService }],
    }).compile();

    controller = module.get<TodoItemsController>(TodoItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return an array of todo items', () => {
      expect(controller.index(1)).toEqual([mockTodoItem]);
      expect(mockTodoItemService.findAllByKeyId).toHaveBeenCalledWith(1);
    });
  });

  describe('show', () => {
    it('should return a todo item', () => {
      expect(controller.show(1)).toEqual(mockTodoItem);
      expect(mockTodoItemService.get).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if item not found', () => {
      expect(() => controller.show(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a todo item', () => {
      const dto: CreateTodoItemDto = {
        description: 'New Item',
        completed: false,
        listId: 1,
      };
      expect(controller.create(1, dto)).toEqual({
        id: 2,
        listId: 1,
        description: 'New Item',
        completed: false,
      });
      expect(mockTodoItemService.create).toHaveBeenCalledWith({
        ...dto,
        listId: 1,
        completed: false,
      });
    });
  });

  describe('update', () => {
    it('should update and return a todo item', () => {
      const dto: UpdateTodoItemDto = {
        description: 'Updated Item',
        listId: 1,
        completed: true,
      };
      expect(controller.update(1, dto)).toEqual({ ...mockTodoItem, ...dto });
      expect(mockTodoItemService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete a todo item', () => {
      expect(() => controller.delete(1)).not.toThrow();
      expect(mockTodoItemService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if item not found', () => {
      expect(() => controller.delete(999)).toThrow(NotFoundException);
    });
  });
});
