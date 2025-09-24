import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TablesModule } from '../tables/tables.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TablesModule, PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
