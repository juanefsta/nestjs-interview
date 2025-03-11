import { Injectable } from '@nestjs/common';
import { nextId } from './utils/id.util';
import { BaseId } from './id.interface';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export abstract class BaseService<T extends BaseId, C, U> {
  protected readonly items: T[] = [];

  constructor(protected readonly syncService: QueueService<T>) { }

  all(): T[] {
    return this.items;
  }

  get(id: number): T {
    return this.items.find((x: any) => Number(x.id) === Number(id));
  }

  create(dto: C): T {
    const newItem: any = {
      id: nextId(this.items),
      ...dto,
    };

    this.items.push(newItem);
    this.syncService.syncCreate(newItem);
    return newItem;
  }

  update(id: number, dto: U): T {
    const itemIndex = this.items.findIndex((x) => Number(x.id) === Number(id));
    if (itemIndex === -1) {
      return null;
    }
    const itemToUpdate = this.items[itemIndex];
    this.items[itemIndex] = {
      ...itemToUpdate,
      ...dto,
    };

    this.syncService.syncUpdate(this.items[itemIndex]);

    return this.items[itemIndex];
  }

  delete(id: number): void {
    const index = this.items.findIndex((x: any) => Number(x.id) === Number(id));
    if (index > -1) {
      const deletedItem = this.items[index];
      this.items.splice(index, 1);

      this.syncService.syncDelete(deletedItem.id);
    }
  }
}
