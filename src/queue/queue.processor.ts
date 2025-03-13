import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Processor('challengeQueue')
export class QueueProcessor {

    private readonly logger = new Logger(QueueProcessor.name);
    constructor(
        private readonly externalApiService: ExternalApiService,
    ) { }

    @Process('synchronize')
    async handleSync(job: Job) {
        this.logger.log(`🔄 Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`);

        const { operation, data } = job.data;
        try {
            switch (operation) {
                case 'createTodoList':
                    await this.externalApiService.createTodoList(data);
                    break;
                case 'updateTodoList':
                    await this.externalApiService.updateTodoList(data);
                    break;
                case 'deleteTodoList':
                    await this.externalApiService.deleteTodoList(data);
                    break;
                default:
                    this.logger.warn(`Unknown operation: ${operation}`);
                    throw new Error(`Unknown operation: ${operation}`);
            }

            this.logger.log(`✅ Job ${job.id} completed successfully. Successfully processed ${operation} for item ${data.id}`);
        } catch (error) {
            this.logger.error(`❌ Job ${job.id} failed for operation -${operation}- and item ${data.id}. Attempt ${job.attemptsMade + 1}. Error: ${error.message}`);
            throw error;
        }
    }
}
