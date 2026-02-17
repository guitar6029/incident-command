import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket, TicketStatus } from './tickets.types';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
@Injectable()
export class TicketsService {
  // add the Ticket type later
  private tickets: Ticket[] = [];
  private readonly transitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],

    [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CANCELLED],

    [TicketStatus.RESOLVED]: [TicketStatus.REOPENED],

    [TicketStatus.REOPENED]: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],

    [TicketStatus.CANCELLED]: [],
  };

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

  updateStatus({
    id,
    dto,
    by,
  }: {
    id: string;
    dto: UpdateTicketStatusDto;
    by: string;
  }): Ticket {
    //check if id exists
    const index = this.getIndexOrThrow(id);

    //get ticket from tickets[index]
    const ticket = this.tickets[index];

    // check if allowed to change
    const allowedStatusChange = this.checkStatusChangeAllowed(
      ticket.status,
      dto.status,
    );

    if (!allowedStatusChange) {
      throw new BadRequestException(
        `Change of status is not allowed from ${ticket.status} to ${dto.status}`,
      );
    }

    const fromStatus = ticket.status;
    //helepr chane status
    this.updatedTicketStatus(index, dto.status);
    // helper updateAt and updatedBy
    this.updateTicketAt(index);
    this.updateTicketBy(index, by);

    //log heler later

    return this.tickets[index];
  }

  private updateTicketAt(index: number) {
    const now = new Date().toISOString();
    this.tickets[index].updatedAt = now;
  }

  private updateTicketBy(index: number, by: string) {
    this.tickets[index].updatedBy = by;
  }

  private getIndexOrThrow(id: string) {
    const idx = this.tickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }

    return idx;
  }

  private updatedTicketStatus(idx: number, toStatus: TicketStatus) {
    this.tickets[idx].status = toStatus;
  }

  private checkStatusChangeAllowed(
    fromStatus: TicketStatus,
    toStatus: TicketStatus,
  ) {
    return this.transitions[fromStatus].includes(toStatus);
  }
}
