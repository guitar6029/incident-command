import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../tickets.types';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
