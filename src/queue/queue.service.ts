import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import { EntityName } from '../common/base.service';

@Injectable()
export class QueueService<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue('challengeQueue') private readonly syncQueue: Queue,
  ) {}

  private readonly defaultSyncOptions: JobOptions = {
    attempts: 1,
    backoff: 5000,
    removeOnComplete: true,
    removeOnFail: false,
    delay: 3000,
  };

  async syncCreate(item: T, entityName: EntityName) {
    const operation = `create${entityName}`;
    this.logger.log(`Adding ${operation} job to queue`);
    await this.syncQueue.add(
      'synchronize',
      {
        operation,
        data: item,
      },
      this.defaultSyncOptions,
    );
  }

  async syncUpdate(item: T, entityName: EntityName) {
    const operation = `update${entityName}`;
    this.logger.log(`Adding ${operation} job to queue`);
    await this.syncQueue.add(
      'synchronize',
      {
        operation,
        data: item,
      },
      this.defaultSyncOptions,
    );
  }

  async syncDelete(item: T, entityName: EntityName) {
    const operation = `delete${entityName}`;
    this.logger.log(`Adding ${operation} job to queue`);
    await this.syncQueue.add(
      'synchronize',
      {
        operation,
        data: item,
      },
      this.defaultSyncOptions,
    );
  }
}
