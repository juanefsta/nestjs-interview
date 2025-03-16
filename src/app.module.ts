import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoItemsModule } from './todo_items/todo_items.module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ScheduleModule.forRoot(),
    QueueModule,
    TodoListsModule,
    TodoItemsModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
