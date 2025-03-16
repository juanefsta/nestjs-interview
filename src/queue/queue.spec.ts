import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiService } from '../external-api/external-api.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';


jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
}));

describe('QueueProcessor', () => {
    let processor: QueueProcessor;
    let externalApiService: ExternalApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QueueProcessor,
                {
                    provide: ExternalApiService,
                    useValue: {
                        createTodoList: jest.fn(),
                        updateTodoList: jest.fn(),
                        deleteTodoList: jest.fn(),
                    },
                },
            ],
        }).compile();

        processor = module.get<QueueProcessor>(QueueProcessor);
        externalApiService = module.get<ExternalApiService>(ExternalApiService);
        jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
        jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
    });

    it('should call createTodoList for create operation', async () => {
        const job = { id: 1, attemptsMade: 0, opts: { attempts: 3 }, data: { operation: 'createTodoList', data: { id: 1 } } } as Job;
        await processor.handleSync(job);
        expect(externalApiService.createTodoList).toHaveBeenCalledWith({ id: 1 });
    });

    it('should call updateTodoList for update operation', async () => {
        const job = { id: 2, attemptsMade: 1, opts: { attempts: 3 }, data: { operation: 'updateTodoList', data: { id: 2 } } } as Job;
        await processor.handleSync(job);
        expect(externalApiService.updateTodoList).toHaveBeenCalledWith({ id: 2 });
    });

    it('should call deleteTodoList for delete operation', async () => {
        const job = { id: 3, attemptsMade: 2, opts: { attempts: 3 }, data: { operation: 'deleteTodoList', data: { id: 3 } } } as Job;
        await processor.handleSync(job);
        expect(externalApiService.deleteTodoList).toHaveBeenCalledWith({ id: 3 });
    });

    it('should log and throw error for unknown operation', async () => {
        const job = { id: 4, attemptsMade: 0, opts: { attempts: 3 }, data: { operation: 'unknown', data: {} } } as Job;
        await expect(processor.handleSync(job)).rejects.toThrow('Unknown operation: unknown');
        expect(processor.handleSync(job)).rejects.toThrow('Unknown operation: unknown');
    });
});

describe('QueueService', () => {
    let service: QueueService<any>;
    let queue: Queue;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QueueService,
                {
                    provide: getQueueToken('challengeQueue'),
                    useValue: {
                        add: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<QueueService<any>>(QueueService);
        queue = module.get<Queue>(getQueueToken('challengeQueue'));
    });

    it('should add create job to queue', async () => {
        await service.syncCreate({ id: 1 }, 'TodoList');
        expect(queue.add).toHaveBeenCalledWith('synchronize', { operation: 'createTodoList', data: { id: 1 } }, expect.any(Object));
    });

    it('should add update job to queue', async () => {
        await service.syncUpdate({ id: 2 }, 'TodoList');
        expect(queue.add).toHaveBeenCalledWith('synchronize', { operation: 'updateTodoList', data: { id: 2 } }, expect.any(Object));
    });

    it('should add delete job to queue', async () => {
        await service.syncDelete({ id: 3 }, 'TodoList');
        expect(queue.add).toHaveBeenCalledWith('synchronize', { operation: 'deleteTodoList', data: { id: 3 } }, expect.any(Object));
    });
});
