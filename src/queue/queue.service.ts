import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
  ) {}

  async joinQueue(userId: string) {
    const existingEntry = await this.prisma.queueEntry.findUnique({
      where: { userId },
    });

    if (existingEntry) {
      throw new BadRequestException('Usuário já está na fila');
    }

    const lastEntry = await this.prisma.queueEntry.findFirst({
      orderBy: { position: 'desc' },
    });

    const position = lastEntry ? lastEntry.position + 1 : 1;

    return this.prisma.queueEntry.create({
      data: {
        userId,
        position,
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
    });
  }

  async leaveQueue(userId: string) {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { userId },
    });

    if (!entry) {
      throw new BadRequestException('Usuário não está na fila');
    }

    await this.prisma.queueEntry.delete({
      where: { userId },
    });

    await this.updatePositions(entry.position);

    return { message: 'Saiu da fila com sucesso' };
  }

  async getQueue() {
    return this.prisma.queueEntry.findMany({
      orderBy: { position: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserPosition(userId: string) {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!entry) {
      return null;
    }

    const totalInQueue = await this.prisma.queueEntry.count();
    const position = await this.prisma.queueEntry.count({
      where: {
        position: {
          lt: entry.position,
        },
      },
    });

    return {
      ...entry,
      position: position + 1,
      totalInQueue,
    };
  }

  async getNextInQueue() {
    return this.prisma.queueEntry.findFirst({
      orderBy: { position: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async notifyNextUser() {
    const nextUser = await this.getNextInQueue();
    
    if (nextUser) {
      await this.prisma.queueEntry.delete({
        where: { userId: nextUser.userId },
      });

      await this.updatePositions(1);

      return nextUser;
    }

    return null;
  }

  private async updatePositions(startFrom: number) {
    const entries = await this.prisma.queueEntry.findMany({
      where: {
        position: {
          gt: startFrom,
        },
      },
      orderBy: { position: 'asc' },
    });

    for (let i = 0; i < entries.length; i++) {
      await this.prisma.queueEntry.update({
        where: { id: entries[i].id },
        data: { position: startFrom + i },
      });
    }
  }
}
