import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TableStatus } from '../types';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.tablesService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: TableStatus) {
    return this.tablesService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}
