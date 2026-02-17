import { Module } from '@nestjs/common';
import { TicketAssignmentService } from './ticket-assignment.service';

@Module({
  providers: [TicketAssignmentService],
  exports: [TicketAssignmentService],
})
export class TicketAssignmentModule {}
