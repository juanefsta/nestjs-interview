import { forwardRef, Module } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';
import { HttpModule } from '@nestjs/axios';
import { TodoListsModule } from '../todo_lists/todo_lists.module';

@Module({
  imports: [HttpModule, forwardRef(() => TodoListsModule)],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class ExternalApiModule {}
