import { Module } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { TodoItemsController } from './todo_items.controller';

@Module({
  imports: [],
  controllers: [TodoItemsController],
  providers: [TodoItemsService]
})
export class TodoItemsModule {}
