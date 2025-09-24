import { IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  tableId: string;
}
