import { IncidentStatus } from 'generated/prisma/enums';

export enum IncidentLogType {
  'STATUS_CHANGED' = 'STATUS_CHANGED',
  'ACKNOWLEDGED' = 'ACKNOWLEDGED',
}

export type IncidentLog = {
  id: string;
  incidentId: string;
  eventType: IncidentLogType;
  at: string;
  by: string;
  note?: string;
  fromStatus: IncidentStatus;
  toStatus: IncidentStatus;
};

export type IncidentLogAppend = {
  incidentId: string;
  fromStatus: IncidentStatus;
  toStatus: IncidentStatus;
  by: string;
  note?: string;
};
