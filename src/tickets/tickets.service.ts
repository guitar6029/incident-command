import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket, TicketStatus } from './tickets.types';
@Injectable()
export class TicketsService {
  // add the Ticket type later
  private tickets: Ticket[] = [];

  create(dto: CreateTicketDto): Ticket {
    const id = randomUUID();
    const now = new Date().toISOString();
    const payload: Ticket = {
      id,
      title: dto.title,
      incidentId: dto.incidentId ?? null,
      description: dto.description,
      requestedBy: dto.requestedBy,
      updatedBy: dto.requestedBy,
      createdAt: now,
      updatedAt: now,
      status: TicketStatus.OPEN,
    };

    //push to tickets
    this.tickets.push(payload);
    return payload;
  }

  findAll(): Ticket[] {
    return this.tickets;
  }

  findById(id: string): Ticket {
    const idx = this.getIndexOrThrow(id);
    return this.tickets[idx];
  }

  private getIndexOrThrow(id: string) {
    const idx = this.tickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }

    return idx;
  }
}
