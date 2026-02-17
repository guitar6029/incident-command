import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketLogsService } from 'src/ticket-logs/ticket-logs.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketLogsService],
})
export class TicketsModule {}
