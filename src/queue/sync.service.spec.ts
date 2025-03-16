import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { TodoItemsService } from '../todo_items/todo_items.service';
import { ExternalApiService } from '../external-api/external-api.service';
import { jest } from '@jest/globals';
import { SyncSchedulerService } from './sync.service';

jest.useFakeTimers();

describe('SyncSchedulerService', () => {
    let service: SyncSchedulerService;
    let externalApiService: ExternalApiService;
    let todoListsService: TodoListsService;
    let todoItemsService: TodoItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SyncSchedulerService,
                {
                    provide: TodoListsService,
                    useValue: { all: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
                },
                {
                    provide: TodoItemsService,
                    useValue: { create: jest.fn(), update: jest.fn(), delete: jest.fn() },
                },
                {
                    provide: ExternalApiService,
                    useValue: { fetchTodoLists: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<SyncSchedulerService>(SyncSchedulerService);
        externalApiService = module.get<ExternalApiService>(ExternalApiService);
        todoListsService = module.get<TodoListsService>(TodoListsService);
        todoItemsService = module.get<TodoItemsService>(TodoItemsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    it('should sync external lists with local', async () => {
        const externalLists = [{ source_id: '1', name: 'External List', updated_at: new Date(), created_at: new Date(), items: [], id: 1 }];

        jest.spyOn(externalApiService, 'fetchTodoLists').mockResolvedValue(externalLists);
        await service.syncExternalWithLocal();

        expect(externalApiService.fetchTodoLists).toHaveBeenCalled();
        expect(todoListsService.all).toHaveBeenCalled();
    });
});
