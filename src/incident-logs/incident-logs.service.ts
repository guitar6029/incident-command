import { Injectable } from '@nestjs/common';
import {
  IncidentLog,
  IncidentLogAppend,
  IncidentLogType,
} from './incident-logs.types';
import { randomUUID } from 'crypto';
import { IncidentStatus } from 'src/incidents/incidents.types';

@Injectable()
export class IncidentLogsService {
  private incidentLogs: IncidentLog[] = [];

  appendStatusChange({
    incidentId,
    fromStatus,
    toStatus,
    by,
    note,
  }: IncidentLogAppend) {
    const id = randomUUID();
    const temp: IncidentLog = {
      id,
      incidentId,
      fromStatus,
      eventType: IncidentLogType.STATUS_CHANGED,
      toStatus,
      at: new Date().toISOString(),
      by,
      note,
    };

    this.incidentLogs.push(temp);

    return temp;
  }

  appendAcknowledgeLog({
    incidentId,
    by,
    fromStatus,
    toStatus,
    note,
  }: IncidentLogAppend) {
    const id = randomUUID();
    const temp: IncidentLog = {
      id,
      incidentId,
      fromStatus,
      eventType: IncidentLogType.ACKNOWLEDGED,
      toStatus,
      at: new Date().toISOString(),
      by,
    };

    if (note) {
      temp.note = note;
    }

    this.incidentLogs.push(temp);

    return temp;
  }

  listByIncidentId(incidentId: string): IncidentLog[] {
    return this.incidentLogs.filter(
      (incidentLog: IncidentLog) => incidentLog.incidentId === incidentId,
    );
  }
}
