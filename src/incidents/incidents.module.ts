import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentLogsModule } from 'src/incident-logs/incident-logs.module';
import { IncidentAcknowledgeService } from 'src/incident-acknowledge/incident-acknowledge.service';

@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService, IncidentAcknowledgeService],
  imports: [IncidentLogsModule],
})
export class IncidentsModule {}
