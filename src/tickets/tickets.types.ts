export type Ticket = {
  id: string;
  title: string;
  incidentId: string | null;
  description: string;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  status: TicketStatus;
};

export enum TicketStatus {
  'OPEN' = 'OPEN',
  'IN_PROGRESS' = 'IN_PROGRESS',
  'RESOLVED' = 'RESOLVED',
  'REOPENED' = 'REOPENED',
  'CANCELLED' = 'CANCELLED',
}
