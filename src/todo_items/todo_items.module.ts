import { forwardRef, Module } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { TodoItemsController } from './todo_items.controller';
import { QueueModule } from 'src/queue/queue.module';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';

@Module({
  imports: [forwardRef(() => QueueModule), forwardRef(() => TodoListsModule)],
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
  exports: [TodoItemsService]
})
export class TodoItemsModule { }
