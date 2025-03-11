import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TodoList } from 'src/common/interfaces/todo_list.interface';

@Injectable()
export class ExternalApiService {
    //TODO: Move to env
    //TODO: Add loggers
    private readonly baseUrl = 'http://localhost:4000/';
    private readonly todoListUrl = 'http://localhost/todolists';

    constructor(private readonly httpService: HttpService) { }

    async createTodoList(todoList: TodoList) {
        try {
            const result = await this.httpService.post(`${this.todoListUrl}`, todoList);
        } catch (e) {
            console.log('createTodoList', e);
        }
    }

    async updateTodoList(todoList: TodoList) {
        try {
            await this.httpService.patch(`${this.todoListUrl}/${todoList.id}`, todoList);
        } catch (e) {
            console.log('update-todolists', e);
        }
    }

    async deleteTodoList(todoListId: number) {
        try {
            await this.httpService.patch(`${this.todoListUrl}/${todoListId}`);
        } catch (e) {
            console.log('delete-todolists', e);
        }
    }
}
