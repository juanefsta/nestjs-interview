import { Injectable } from '@nestjs/common';
import { nextId } from './utils/id.util';
import { BaseId } from './id.interface';

@Injectable()
export abstract class BaseService<T extends BaseId, C, U> {
  protected readonly items: T[] = [];

  all(): T[] {
    return this.items;
  }

  get(id: number): T {
    return this.items.find((x: any) => x.id === id);
  }

  create(dto: C): T {
    const newItem: any = {
      id: nextId(this.items),
      ...dto,
    };

    this.items.push(newItem);
    return newItem;
  }

  update(id: number, dto: U): T {
    const item = this.items.find((x: any) => x.id === id);
    Object.assign(item, dto);
    return item;
  }

  delete(id: number): void {
    const index = this.items.findIndex((x: any) => x.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
