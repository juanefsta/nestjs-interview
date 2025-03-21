import { forwardRef, Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { QueueModule } from '../queue/queue.module';
import { TodoItemsModule } from '../todo_items/todo_items.module';

@Module({
  imports: [QueueModule, forwardRef(() => TodoItemsModule)],
  controllers: [TodoListsController],
  providers: [TodoListsService],
  exports: [TodoListsService],
})
export class TodoListsModule {}
