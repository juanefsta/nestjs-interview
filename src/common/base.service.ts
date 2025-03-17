import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { nextId } from './utils/id.util';
import { QueueService } from '../queue/queue.service';
import { BaseInterface } from './interfaces/base.interface';

export type EntityName = 'TodoList' | 'TodoItem';
@Injectable()
export abstract class BaseService<T extends BaseInterface, C, U> {
  protected readonly items: T[] = [];
  protected readonly logger = new Logger(this.constructor.name);
  constructor(
    protected readonly queueService: QueueService<T>,
    protected readonly entityName: EntityName,
  ) {}

  all(): T[] {
    this.logger.log(`Fetching all ${this.entityName}`);
    return this.items;
  }

  get(id: number): T {
    this.logger.log(`Fetching ${this.entityName} with ID: ${id}`);

    const item = this.items.find((x: any) => Number(x.id) === Number(id));
    if (!item) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return item;
  }

  create(dto: C, disableSync?: boolean): T {
    try {
      const now = new Date();
      const id = nextId(this.items);
      const newItem: any = {
        id,
        ...dto,
        created_at: now,
        updated_at: now,
        source_id: id.toString(),
      };

      this.items.push(newItem);
      this.logger.log(`Created new ${this.entityName} with ID: ${newItem.id}`);

      if (!disableSync) {
        this.queueService.syncCreate(newItem, this.entityName);
      }
      return newItem;
    } catch (error) {
      this.logger.error(`Error creating new ${this.entityName}`);
      throw error;
    }
  }

  update(id: number, dto: U, disableSync?: boolean): T {
    try {
      const itemIndex = this.items.findIndex(
        (x) => Number(x.id) === Number(id),
      );
      if (itemIndex === -1) {
        this.logger.error(
          `${this.entityName} with ID ${id} not found for update`,
        );
        throw new Error(
          `${this.entityName} with ID ${id} not found for update`,
        );
      }
      const itemToUpdate = this.items[itemIndex];
      this.items[itemIndex] = {
        ...itemToUpdate,
        ...dto,
        updated_at: new Date(),
      };
      this.logger.log(`Updated ${this.entityName} with ID: ${id}`);

      if (!disableSync) {
        this.queueService.syncUpdate(this.items[itemIndex], this.entityName);
      }

      return this.items[itemIndex];
    } catch (error) {
      this.logger.error(`Error updating ${this.entityName} with ID: ${id}`);
      throw error;
    }
  }

  delete(id: number, disableSync?: boolean): void {
    const index = this.items.findIndex((x: any) => Number(x.id) === Number(id));
    if (index > -1) {
      const deletedItem = this.items[index];
      this.items.splice(index, 1);
      this.logger.log(`Deleted ${this.entityName} with ID: ${id}`);
      if (!disableSync) {
        this.queueService.syncDelete(deletedItem, this.entityName);
      }
      return;
    }
    this.logger.error(
      `${this.entityName} with ID ${id} not found for deletion`,
    );
    throw new Error(`${this.entityName} with ID ${id} not found for deletion`);
  }
}
