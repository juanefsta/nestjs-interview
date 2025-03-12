import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { QueueModule } from 'src/queue/queue.module';
import { TodoItemsModule } from 'src/todo_items/todo_items.module';

@Module({
  imports: [QueueModule, TodoItemsModule],
  controllers: [TodoListsController],
  providers: [TodoListsService],
})
export class TodoListsModule { }
