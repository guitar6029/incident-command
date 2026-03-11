import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from 'generated/prisma/client';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
