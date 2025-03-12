import { Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from "@bull-board/api/bullAdapter";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'challengeQueue',
        }),
        BullBoardModule.forFeature({
            name: 'challengeQueue',
            adapter: BullAdapter,
        }), ExternalApiModule],
    providers: [QueueProcessor, QueueService],
    exports: [QueueService, BullModule],
})
export class QueueModule { }
