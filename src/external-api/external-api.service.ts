import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TodoList } from '../common/interfaces/todo_list.interface';
import { CreateExternalTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateExternalTodoItemDto } from './dtos/update-todo_item.dto';
import { ExternalTodoList } from '../common/interfaces/external.base.interfaces';

@Injectable()
export class ExternalApiService {
  private readonly baseUrl = 'http://localhost';
  private readonly todoListUrl = `${this.baseUrl}/todolists`;
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly httpService: HttpService) {}

  async createTodoList(todoList: TodoList) {
    const dto: CreateExternalTodoItemDto = {
      source_id: todoList.id,
      name: todoList.name,
      items: todoList.items,
    };

    try {
      this.logger.log(
        `Creating TodoList in External API | ${JSON.stringify(dto)}`,
      );

      const result = await lastValueFrom(
        this.httpService.post(`${this.todoListUrl}`, dto),
      );

      this.logger.log(
        `TodoList created in External API | ${JSON.stringify(result.data)}`,
      );
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to create TodoList: ${error.message}`);
      throw new Error(`Failed to create TodoList: ${error.message}`);
    }
  }

  async updateTodoList(todoList: TodoList) {
    const dto: UpdateExternalTodoItemDto = {
      name: todoList.name,
    };
    try {
      this.logger.log(
        `Updating TodoList in External API | ${JSON.stringify(dto)}`,
      );

      const result = await lastValueFrom(
        this.httpService.patch(`${this.todoListUrl}/${todoList.id}`, dto),
      );

      this.logger.log(
        `TodoList updated in External API | ${JSON.stringify(result.data)}`,
      );
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to update TodoList: ${error.message}`);
      throw new Error(`Failed to update TodoList: ${error.message}`);
    }
  }

  async deleteTodoList(todoList: TodoList) {
    try {
      this.logger.log(`Deleting TodoList in External API | ID: ${todoList.id}`);

      const result = await lastValueFrom(
        this.httpService.delete(`${this.todoListUrl}/${todoList.id}`),
      );

      this.logger.log(
        `TodoList deleted in External API | ${JSON.stringify(result.data)}`,
      );
      return result.data;
    } catch (error) {
      this.logger.error(`TodoList ${todoList.id} already deleted.`);
      throw new Error(
        `Failed to delete TodoList ${todoList.id}: ${error.message}`,
      );
    }
  }

  async fetchTodoLists(): Promise<ExternalTodoList[]> {
    try {
      this.logger.log(`Fetching TodoLists in External API`);

      const result = await lastValueFrom(
        this.httpService.get(`${this.todoListUrl}`),
      );

      this.logger.log(
        `TodoLists fetched in External API | ${JSON.stringify(result.data)}`,
      );
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to fetch TodoLists: ${error.message}`);
    }
  }
}
