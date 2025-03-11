import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [TodoListsController],
  providers: [TodoListsService],
})
export class TodoListsModule { }
