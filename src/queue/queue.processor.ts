import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Processor('todoListQueue')
export class QueueProcessor {

    private readonly logger = new Logger(QueueProcessor.name);
    constructor(
        // private readonly todoService: TodoService,
        private readonly externalApiService: ExternalApiService,
    ) { }

    @Process('synchronize')
    async handleSync(job: Job) {

        const { operation, data } = job.data;

        switch (operation) {
            case 'create':
                await this.externalApiService.createTodoList(data);
                break;
            case 'update':
                await this.externalApiService.updateTodoList(data);
                break;
            case 'delete':
                await this.externalApiService.deleteTodoList(data.id);
                break;
            default:
                console.warn('Unknown operation:', operation);
        }
    }
}
