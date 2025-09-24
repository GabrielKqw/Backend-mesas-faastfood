import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableStatus } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      include: {
        reservations: {
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
          },
        },
        orders: {
          where: {
            status: {
              in: ['PENDING', 'IN_PREPARATION', 'READY'],
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAvailable() {
    return this.prisma.table.findMany({
      where: {
        status: 'FREE',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
      include: {
        reservations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        orders: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async updateStatus(id: string, status: TableStatus) {
    return this.prisma.table.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.table.delete({
      where: { id },
    });
  }
}
