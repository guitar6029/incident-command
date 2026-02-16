import { Controller } from '@nestjs/common';
import { IncidentAcknowledgeService } from './incident-acknowledge.service';

@Controller('incident-acknowledge')
export class IncidentAcknowledgeController {
  constructor(private readonly incidentAcknowledgeService: IncidentAcknowledgeService) {}
}
