export enum Severity {
  SEV1 = 'SEV1',
  SEV2 = 'SEV2',
  SEV3 = 'SEV3',
}

export enum IncidentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  REOPENED = 'REOPENED',
  OPEN = 'OPEN',
}

export type IncidentCase = {
  id: string;
  title: string;
  severity: Severity;
  reportedBy: string;
  summary?: string;
  status: IncidentStatus;
  createdAt: string;
};
