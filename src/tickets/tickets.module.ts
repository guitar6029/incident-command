import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketLogsService } from 'src/ticket-logs/ticket-logs.service';
import { TicketAssignmentService } from 'src/ticket-assignment/ticket-assignment.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketLogsService, TicketAssignmentService],
})
export class TicketsModule {}
