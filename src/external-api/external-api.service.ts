import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TodoItem } from 'src/common/interfaces/todo_item.interface';
import { TodoList } from 'src/common/interfaces/todo_list.interface';
import { CreateExternalTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateExternalTodoItemDto } from './dtos/update-todo_item.dto';
import { ExternalTodoList } from 'src/common/interfaces/external.base.interfaces';

@Injectable()
export class ExternalApiService {
    //TODO: Move to env
    //TODO: Add loggers
    private readonly baseUrl = 'http://localhost';
    private readonly todoListUrl = `${this.baseUrl}/todolists`;

    constructor(private readonly httpService: HttpService) { }

    async createTodoList(todoList: TodoList) {
        const dto: CreateExternalTodoItemDto = {
            source_id: todoList.id,
            name: todoList.name,
            items: todoList.items,
        };

        try {
            const result = await (lastValueFrom(this.httpService.post(`${this.todoListUrl}`, dto)));
            return result.data;
        } catch (error) {
            throw new Error(`Failed to create TodoList: ${error.message}`);
        }
    }

    async updateTodoList(todoList: TodoList) {
        const dto: UpdateExternalTodoItemDto = {
            name: todoList.name,
        };
        try {
            const result = await (lastValueFrom(this.httpService.patch(`${this.todoListUrl}/${todoList.id}`, dto)));
            return result.data;
        } catch (error) {
            throw new Error(`Failed to update TodoList: ${error.message}`);
        }
    }

    async deleteTodoList(todoList: TodoList) {
        try {
            const result = await (lastValueFrom(this.httpService.delete(`${this.todoListUrl}/${todoList.id}`)));
            return result.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log(`TodoList ${todoList.id} already deleted.`);
            } else {
                throw new Error(`Failed to delete TodoList ${todoList.id}: ${error.message}`);
            }
        }
    }

    async fetchTodoLists(): Promise<ExternalTodoList[]> {
        try {
            const result = await (lastValueFrom(this.httpService.get(`${this.todoListUrl}`)));
            return result.data;
        } catch (e) {
            console.error('Error fetching TodoLists', e);
            return [];
        }
    }
}
