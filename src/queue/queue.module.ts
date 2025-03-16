import { forwardRef, Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';
import { ExternalApiModule } from '../external-api/external-api.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { SyncSchedulerService } from './sync.service';
import { TodoListsModule } from '../todo_lists/todo_lists.module';
import { TodoItemsModule } from '../todo_items/todo_items.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'challengeQueue',
        }),
        BullBoardModule.forFeature({
            name: 'challengeQueue',
            adapter: BullAdapter,
        }), forwardRef(() => TodoListsModule), forwardRef(() => TodoItemsModule), ExternalApiModule],
    providers: [QueueProcessor, QueueService, SyncSchedulerService],
    exports: [QueueService, BullModule],
})
export class QueueModule { }
