import { IsString, IsOptional, IsNumber, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem } from '../types';

export class CreateOrderDto {
  @IsString()
  tableId: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  items?: OrderItem[];
}
