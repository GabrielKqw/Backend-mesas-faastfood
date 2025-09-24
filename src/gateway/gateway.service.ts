import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TablesService } from '../tables/tables.service';
import { ReservationsService } from '../reservations/reservations.service';
import { OrdersService } from '../orders/orders.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class GatewayService {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GatewayService.name);

  constructor(
    private tablesService: TablesService,
    private reservationsService: ReservationsService,
    private ordersService: OrdersService,
    private queueService: QueueService,
  ) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.join(data.room);
    this.logger.log(`Cliente ${client.id} entrou na sala ${data.room}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.room);
    this.logger.log(`Cliente ${client.id} saiu da sala ${data.room}`);
  }

  @SubscribeMessage('get-tables')
  async handleGetTables(@ConnectedSocket() client: Socket) {
    try {
      const tables = await this.tablesService.findAll();
      client.emit('tables-updated', tables);
    } catch (error) {
      this.logger.error('Erro ao buscar mesas:', error);
      client.emit('error', { message: 'Erro ao buscar mesas' });
    }
  }

  @SubscribeMessage('get-reservations')
  async handleGetReservations(@ConnectedSocket() client: Socket) {
    try {
      const reservations = await this.reservationsService.findAll();
      client.emit('reservations-updated', reservations);
    } catch (error) {
      this.logger.error('Erro ao buscar reservas:', error);
      client.emit('error', { message: 'Erro ao buscar reservas' });
    }
  }

  @SubscribeMessage('get-orders')
  async handleGetOrders(@ConnectedSocket() client: Socket) {
    try {
      const orders = await this.ordersService.findAll();
      client.emit('orders-updated', orders);
    } catch (error) {
      this.logger.error('Erro ao buscar pedidos:', error);
      client.emit('error', { message: 'Erro ao buscar pedidos' });
    }
  }

  @SubscribeMessage('get-queue')
  async handleGetQueue(@ConnectedSocket() client: Socket) {
    try {
      const queue = await this.queueService.getQueue();
      client.emit('queue-updated', queue);
    } catch (error) {
      this.logger.error('Erro ao buscar fila:', error);
      client.emit('error', { message: 'Erro ao buscar fila' });
    }
  }

  async broadcastTablesUpdate() {
    try {
      const tables = await this.tablesService.findAll();
      this.server.emit('tables-updated', tables);
    } catch (error) {
      this.logger.error('Erro ao broadcast mesas:', error);
    }
  }

  async broadcastReservationsUpdate() {
    try {
      const reservations = await this.reservationsService.findAll();
      this.server.emit('reservations-updated', reservations);
    } catch (error) {
      this.logger.error('Erro ao broadcast reservas:', error);
    }
  }

  async broadcastOrdersUpdate() {
    try {
      const orders = await this.ordersService.findAll();
      this.server.emit('orders-updated', orders);
    } catch (error) {
      this.logger.error('Erro ao broadcast pedidos:', error);
    }
  }

  async broadcastQueueUpdate() {
    try {
      const queue = await this.queueService.getQueue();
      this.server.emit('queue-updated', queue);
    } catch (error) {
      this.logger.error('Erro ao broadcast fila:', error);
    }
  }

  async notifyUser(userId: string, event: string, data: Record<string, unknown>) {
    this.server.emit(`user-${userId}`, { event, data });
  }

  async notifyTableAvailable(tableId: string) {
    this.server.emit('table-available', { tableId });
  }

  async notifyQueuePosition(userId: string, position: number) {
    this.server.emit(`user-${userId}`, { 
      event: 'queue-position', 
      data: { position } 
    });
  }
}
