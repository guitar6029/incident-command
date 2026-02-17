import { Injectable } from '@nestjs/common';
import { TicketLog, TicketLogAppend, TicketLogType } from './ticket-logs.types';
import { randomUUID } from 'crypto';

@Injectable()
export class TicketLogsService {
  private ticketLogs: TicketLog[] = [];

  appendStatusChange({
    ticketId,
    fromStatus,
    toStatus,
    by,
    note,
  }: TicketLogAppend) {
    const id = randomUUID();
    const temp: TicketLog = {
      id,
      ticketId,
      fromStatus,
      eventType: TicketLogType.STATUS_CHANGED,
      toStatus,
      at: new Date().toISOString(),
      by,
    };

    if (note) {
      temp.note = note;
    }

    this.ticketLogs.push(temp);

    return temp;
  }
}
