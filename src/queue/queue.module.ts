import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { TablesModule } from '../tables/tables.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TablesModule, PrismaModule],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
