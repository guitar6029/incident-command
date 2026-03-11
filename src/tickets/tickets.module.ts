import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketAssignmentService } from 'src/ticket-assignment/ticket-assignment.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketAssignmentService],
})
export class TicketsModule {}
