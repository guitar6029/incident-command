import { Module } from '@nestjs/common';
import { TicketLogsService } from './ticket-logs.service';

@Module({
  providers: [TicketLogsService]
})
export class TicketLogsModule {}
