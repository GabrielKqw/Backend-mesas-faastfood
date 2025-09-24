import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const table = await this.tablesService.findOne(createReservationDto.tableId);
    
    if (!table) {
      throw new BadRequestException('Mesa não encontrada');
    }

    if (table.status !== 'FREE') {
      throw new BadRequestException('Mesa não está disponível');
    }

    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        tableId: createReservationDto.tableId,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingReservation) {
      throw new BadRequestException('Mesa já possui reserva ativa');
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const reservation = await this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        userId,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        table: true,
      },
    });

    await this.tablesService.updateStatus(createReservationDto.tableId, 'RESERVED');

    return reservation;
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        table: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        table: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        table: true,
      },
    });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.prisma.reservation.update({
      where: { id },
      data: updateReservationDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        table: true,
      },
    });
  }

  async cancel(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id,
        userId,
        status: 'ACTIVE',
      },
    });

    if (!reservation) {
      throw new BadRequestException('Reserva não encontrada ou já cancelada');
    }

    await this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.tablesService.updateStatus(reservation.tableId, 'FREE');

    return { message: 'Reserva cancelada com sucesso' };
  }

  async complete(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new BadRequestException('Reserva não encontrada');
    }

    await this.prisma.reservation.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    await this.tablesService.updateStatus(reservation.tableId, 'FREE');

    return { message: 'Reserva finalizada com sucesso' };
  }

  async remove(id: string) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }

  async expireReservations() {
    const expiredReservations = await this.prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    for (const reservation of expiredReservations) {
      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'EXPIRED' },
      });

      await this.tablesService.updateStatus(reservation.tableId, 'FREE');
    }

    return expiredReservations.length;
  }
}
