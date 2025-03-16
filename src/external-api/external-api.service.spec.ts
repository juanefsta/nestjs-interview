import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiService } from './external-api.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
}));

describe('ExternalApiService', () => {
  let service: ExternalApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalApiService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExternalApiService>(ExternalApiService);
    httpService = module.get<HttpService>(HttpService);

    jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
  });

  describe('createTodoList', () => {
    it('should call the API and return data', async () => {
      const mockTodoList = {
        id: 1,
        name: 'Test',
        items: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 201,
        statusText: 'Created',
        headers: { 'Content-Type': 'application/json' },
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.createTodoList(mockTodoList);
      expect(result).toEqual(mockResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost/todolists',
        {
          source_id: 1,
          name: 'Test',
          items: [],
        },
      );
    });

    it('should log error and throw on API failure', async () => {
      const mockTodoList = {
        id: 1,
        name: 'Test',
        items: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error('API Error')));
      await expect(service.createTodoList(mockTodoList)).rejects.toThrow(
        'Failed to create TodoList: API Error',
      );
    });
  });

  describe('updateTodoList', () => {
    it('should call the API and return data', async () => {
      const mockTodoList = {
        id: 1,
        name: 'Updated',
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      };
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'patch').mockReturnValue(of(mockResponse));

      const result = await service.updateTodoList(mockTodoList);
      expect(result).toEqual(mockResponse.data);
      expect(httpService.patch).toHaveBeenCalledWith(
        'http://localhost/todolists/1',
        { name: 'Updated' },
      );
    });

    it('should log error and throw on API failure', async () => {
      const mockTodoList = {
        id: 1,
        name: 'Updated',
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      };
      jest
        .spyOn(httpService, 'patch')
        .mockReturnValue(throwError(() => new Error('API Error')));
      await expect(service.updateTodoList(mockTodoList)).rejects.toThrow(
        'Failed to update TodoList: API Error',
      );
    });
  });

  describe('deleteTodoList', () => {
    it('should call the API and return data', async () => {
      const mockTodoList = {
        id: 1,
        name: 'ToDelete',
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      };
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'delete').mockReturnValue(of(mockResponse));

      const result = await service.deleteTodoList(mockTodoList);
      expect(result).toEqual(mockResponse.data);
      expect(httpService.delete).toHaveBeenCalledWith(
        'http://localhost/todolists/1',
      );
    });

    it('should log error and throw on API failure', async () => {
      const mockTodoList = {
        id: 1,
        name: 'ToDelete',
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      };
      jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(throwError(() => new Error('API Error')));
      await expect(service.deleteTodoList(mockTodoList)).rejects.toThrow(
        'Failed to delete TodoList 1: API Error',
      );
    });
  });

  describe('fetchTodoLists', () => {
    it('should call the API and return data', async () => {
      const mockResponse: AxiosResponse = {
        data: [{ id: 1, name: 'Test' }],
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.fetchTodoLists();
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'http://localhost/todolists',
      );
    });

    it('should log error but not throw on API failure', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('API Error')));
      await expect(service.fetchTodoLists()).resolves.toBeUndefined();
    });
  });
});
