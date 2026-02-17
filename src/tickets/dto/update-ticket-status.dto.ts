import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../tickets.types';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
