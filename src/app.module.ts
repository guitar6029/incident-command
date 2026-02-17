import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncidentsModule } from './incidents/incidents.module';
import { UsersModule } from './users/users.module';
import { ActionsModule } from './actions/actions.module';
import { HealthModule } from './health/health.module';
import { IncidentLogsModule } from './incident-logs/incident-logs.module';
import { IncidentAcknowledgeModule } from './incident-acknowledge/incident-acknowledge.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketLogsModule } from './ticket-logs/ticket-logs.module';

@Module({
  imports: [IncidentsModule, UsersModule, ActionsModule, HealthModule, IncidentLogsModule, IncidentAcknowledgeModule, TicketsModule, TicketLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
