import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentLogsModule } from 'src/incident-logs/incident-logs.module';

@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService],
  imports: [IncidentLogsModule],
})
export class IncidentsModule {}
