import { Injectable } from '@nestjs/common';
import { AcknoledgeIncidentDto } from './dto/acknowledge-incident.dto';
import { IncidentStatus } from 'src/incidents/incidents.types';

@Injectable()
export class IncidentAcknowledgeService {
  acknowledge(dto: AcknoledgeIncidentDto): {
    acknowledgedBy: string;
    acknowledgedAt: string;
    acknowledgedNote?: string | null;
  } {
    // if allowed, update the propertiesF
    // acknowledgedBy and acknowledgedAt and add optional ack note
    const tempIncidentUpdated = {
      acknowledgedBy: dto.by,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedNote: dto.note ?? null,
    };

    return tempIncidentUpdated;
  }

  allowedAcknowledgeCheck(status: IncidentStatus): boolean {
    if (status === IncidentStatus.OPEN) {
      return true;
    }
    return false;
  }
}
