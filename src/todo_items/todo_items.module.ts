import { Module } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { TodoItemsController } from './todo_items.controller';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [TodoItemsController],
  providers: [TodoItemsService]
})
export class TodoItemsModule { }
