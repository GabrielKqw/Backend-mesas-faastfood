import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from '../types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('table/:tableId')
  findByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findByTable(tableId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  complete(@Param('id') id: string) {
    return this.ordersService.complete(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
