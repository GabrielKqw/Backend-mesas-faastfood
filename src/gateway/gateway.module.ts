import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { TablesModule } from '../tables/tables.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { OrdersModule } from '../orders/orders.module';
import { QueueModule } from '../queue/queue.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TablesModule, ReservationsModule, OrdersModule, QueueModule, PrismaModule],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
