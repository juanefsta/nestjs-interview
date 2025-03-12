import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TodoList } from 'src/common/interfaces/todo_list.interface';

@Injectable()
export class ExternalApiService {
    //TODO: Move to env
    //TODO: Add loggers
    private readonly baseUrl = 'http://localhost';
    private readonly todoListUrl = `${this.baseUrl}/todolists`;

    constructor(private readonly httpService: HttpService) { }

    async createTodoList(todoList: TodoList) {
        try {
            const result = await (lastValueFrom(this.httpService.post(`${this.todoListUrl}`, todoList)));
            return result.data;
        } catch (error) {
            throw new Error(`Failed to create TodoList: ${error.message}`);
        }
    }

    async updateTodoList(todoList: TodoList) {
        try {
            const result = await (lastValueFrom(this.httpService.patch(`${this.todoListUrl}/${todoList.id}`, todoList)));
            return result.data;
        } catch (error) {
            throw new Error(`Failed to update TodoList: ${error.message}`);
        }
    }

    async deleteTodoList(todoListId: number) {
        try {
            const result = await (lastValueFrom(this.httpService.delete(`${this.todoListUrl}/${todoListId}`)));
            return result.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log(`TodoList ${todoListId} already deleted.`);
            } else {
                throw new Error(`Failed to delete TodoList ${todoListId}: ${error.message}`);
            }
        }
    }

    async updateTodoItem(todoList: TodoList) {
        try {
            const result = await (lastValueFrom(this.httpService.patch(`${this.todoListUrl}/${todoList.id}`, todoList)));
            return result.data;
        } catch (error) {
            throw new Error(`Failed to update TodoList: ${error.message}`);
        }
    }

    async deleteTodoItem(todoListId: number) {
        try {
            const result = await (lastValueFrom(this.httpService.delete(`${this.todoListUrl}/${todoListId}`)));
            return result.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log(`TodoList ${todoListId} already deleted.`);
            } else {
                throw new Error(`Failed to delete TodoList ${todoListId}: ${error.message}`);
            }
        }
    }
}
