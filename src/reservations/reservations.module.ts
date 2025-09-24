import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TablesModule } from '../tables/tables.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TablesModule, PrismaModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
