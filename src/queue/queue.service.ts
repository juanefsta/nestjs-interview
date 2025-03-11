import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService<T> {
    constructor(@InjectQueue('todoListQueue') private readonly syncQueue: Queue) { }


    async syncCreate(item: T) {
        await this.syncQueue.add('synchronize', {
            operation: `create`,
            data: item,
        });
    }

    async syncUpdate(item: T) {
        await this.syncQueue.add('synchronize', {
            operation: 'update',
            data: item,
        });
    }

    async syncDelete(itemId: number) {
        await this.syncQueue.add('synchronize', {
            operation: 'delete',
            data: { id: itemId },
        });
    }
}
