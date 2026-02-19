import { Injectable } from '@nestjs/common';
import { AcknoledgeIncidentDto } from './dto/acknowledge-incident.dto';
import { IncidentStatus } from 'generated/prisma/enums';

@Injectable()
export class IncidentAcknowledgeService {
  acknowledge(dto: AcknoledgeIncidentDto): {
    acknowledgedAt: string;
    acknowledgedNote?: string | null;
  } {
    // if allowed, update the propertiesF
    // acknowledgedBy and acknowledgedAt and add optional ack note
    const tempIncidentUpdated = {
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
