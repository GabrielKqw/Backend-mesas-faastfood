import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TablesModule } from './tables/tables.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OrdersModule } from './orders/orders.module';
import { QueueModule } from './queue/queue.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TablesModule,
    ReservationsModule,
    OrdersModule,
    QueueModule,
    GatewayModule,
  ],
})
export class AppModule {}
