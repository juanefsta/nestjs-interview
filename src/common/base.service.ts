import { Injectable } from '@nestjs/common';
import { nextId } from './utils/id.util';
import { BaseId } from './id.interface';
import { QueueService } from 'src/queue/queue.service';

export type EntityName = 'TodoList' | 'TodoItem';
@Injectable()
export abstract class BaseService<T extends BaseId, C, U> {
  protected readonly items: T[] = [];

  constructor(protected readonly syncService: QueueService<T>, protected readonly entityName: EntityName) { }

  all(): T[] {
    return this.items;
  }

  get(id: number): T {
    return this.items.find((x: any) => Number(x.id) === Number(id));
  }

  create(dto: C, disableSync?: boolean): T {
    const newItem: any = {
      id: nextId(this.items),
      ...dto,
    };

    this.items.push(newItem);

    if (!disableSync) {
      this.syncService.syncCreate(newItem, this.entityName);
    }
    return newItem;
  }

  update(id: number, dto: U, disableSync?: boolean): T {
    const itemIndex = this.items.findIndex((x) => Number(x.id) === Number(id));
    if (itemIndex === -1) {
      return null;
    }
    const itemToUpdate = this.items[itemIndex];
    this.items[itemIndex] = {
      ...itemToUpdate,
      ...dto,
    };

    if (!disableSync) {
      this.syncService.syncUpdate(this.items[itemIndex], this.entityName);
    }

    return this.items[itemIndex];
  }

  delete(id: number, disableSync?: boolean): void {
    const index = this.items.findIndex((x: any) => Number(x.id) === Number(id));
    if (index > -1) {
      const deletedItem = this.items[index];
      this.items.splice(index, 1);

      if (!disableSync) {
        this.syncService.syncDelete(deletedItem.id, this.entityName);
      }

    }
  }
}
