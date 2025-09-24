import { Controller, Get, Post, Delete, UseGuards, Request } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('join')
  @UseGuards(JwtAuthGuard)
  joinQueue(@Request() req) {
    return this.queueService.joinQueue(req.user.userId);
  }

  @Delete('leave')
  @UseGuards(JwtAuthGuard)
  leaveQueue(@Request() req) {
    return this.queueService.leaveQueue(req.user.userId);
  }

  @Get()
  getQueue() {
    return this.queueService.getQueue();
  }

  @Get('my-position')
  @UseGuards(JwtAuthGuard)
  getUserPosition(@Request() req) {
    return this.queueService.getUserPosition(req.user.userId);
  }

  @Get('next')
  @UseGuards(JwtAuthGuard)
  getNextInQueue() {
    return this.queueService.getNextInQueue();
  }

  @Post('notify-next')
  @UseGuards(JwtAuthGuard)
  notifyNextUser() {
    return this.queueService.notifyNextUser();
  }
}
