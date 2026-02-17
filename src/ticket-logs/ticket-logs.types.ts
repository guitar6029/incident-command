import { TicketStatus } from 'src/tickets/tickets.types';

export enum TicketLogType {
  STATUS_CHANGED = 'STATUS_CHANGED',
}

export type TicketLog = {
  id: string;
  ticketId: string;
  eventType: TicketLogType;
  at: string;
  by: string;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  note?: string;
};

export type TicketLogAppend = {
  ticketId: string;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  by: string;
  note?: string;
};
