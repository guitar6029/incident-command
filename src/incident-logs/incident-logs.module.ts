import { Module } from '@nestjs/common';
import { IncidentLogsService } from './incident-logs.service';

@Module({
  providers: [IncidentLogsService],
  exports: [IncidentLogsService],
})
export class IncidentLogsModule {}
