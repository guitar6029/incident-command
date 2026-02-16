import { Module } from '@nestjs/common';
import { IncidentAcknowledgeService } from './incident-acknowledge.service';
import { IncidentAcknowledgeController } from './incident-acknowledge.controller';

@Module({
  controllers: [IncidentAcknowledgeController],
  providers: [IncidentAcknowledgeService],
  exports: [IncidentAcknowledgeService],
})
export class IncidentAcknowledgeModule {}
