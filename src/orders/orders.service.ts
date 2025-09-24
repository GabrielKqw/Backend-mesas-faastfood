import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const table = await this.tablesService.findOne(createOrderDto.tableId);
    
    if (!table) {
      throw new BadRequestException('Mesa não encontrada');
    }

    if (table.status === 'FREE') {
      throw new BadRequestException('Mesa não está ocupada');
    }

    const existingOrder = await this.prisma.order.findFirst({
      where: {
        tableId: createOrderDto.tableId,
        status: {
          in: ['PENDING', 'IN_PREPARATION', 'READY'],
        },
      },
    });

    if (existingOrder) {
      throw new BadRequestException('Mesa já possui pedido ativo');
    }

    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        userId,
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

    await this.tablesService.updateStatus(createOrderDto.tableId, 'OCCUPIED');

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
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
            email: true,
          },
        },
        table: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTable(tableId: string) {
    return this.prisma.order.findMany({
      where: { tableId },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
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
    return this.prisma.order.findUnique({
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
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

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
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

  async complete(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new BadRequestException('Pedido não encontrado');
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });

    await this.tablesService.updateStatus(order.tableId, 'WAITING_CLEANUP');

    return { message: 'Pedido finalizado com sucesso' };
  }

  async cancel(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new BadRequestException('Pedido não encontrado');
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.tablesService.updateStatus(order.tableId, 'FREE');

    return { message: 'Pedido cancelado com sucesso' };
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
