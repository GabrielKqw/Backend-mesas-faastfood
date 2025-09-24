import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(createReservationDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findByUser(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Request() req) {
    return this.reservationsService.cancel(id, req.user.userId);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  complete(@Param('id') id: string) {
    return this.reservationsService.complete(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
