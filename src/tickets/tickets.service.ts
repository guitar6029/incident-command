import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  Employee,
  Ticket,
  TicketLog,
  TicketLogType,
  TicketStatus,
} from '../../generated/prisma/client';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { prisma } from '../lib/prisma';

@Injectable()
export class TicketsService {
  private readonly transitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],

    [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CANCELLED],

    [TicketStatus.RESOLVED]: [TicketStatus.REOPENED],

    [TicketStatus.REOPENED]: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],

    [TicketStatus.CANCELLED]: [],
  };

  async create(userId: string, dto: CreateTicketDto): Promise<Ticket> {
    return prisma.ticket.create({
      data: {
        title: dto.title,
        incidentId: dto.incidentId ?? null,
        description: dto.description,
        requestedByEmail: dto.requestedByEmail,
        updatedByEmployeeId: userId,
        status: TicketStatus.OPEN,
      },
    });
  }
  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketOrThrow(id);
    return ticket;
  }

  async getTicketLogById(
    id: string,
    ticketType?: TicketLogType,
  ): Promise<TicketLog[]> {
    await this.ticketOrThrow(id);

    return prisma.ticketLog.findMany({
      where: {
        ticketId: id,
        ...(ticketType ? { eventType: ticketType } : {}),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findAll(): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async updateStatus({
    id,
    dto,
    userId,
  }: {
    id: string;
    dto: UpdateTicketStatusDto;
    userId: string;
  }): Promise<Ticket> {
    const ticket = await this.ticketOrThrow(id);

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

    const employee = await this.employeeOrThrow(userId);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.ticket.updateMany({
        where: {
          id,
          status: ticket.status,
        },
        data: {
          status: dto.status,
          updatedByEmployeeId: employee.id,
          updatedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        throw new BadRequestException(
          'Ticket status was modified by another request',
        );
      }

      const updatedTicket = await tx.ticket.findUniqueOrThrow({
        where: { id },
      });

      // update the ticket log todo
      await tx.ticketLog.create({
        data: {
          ticketId: id,
          eventType: 'STATUS_CHANGED',
          byEmployeeId: employee.id,
          fromStatus: fromStatus,
          toStatus: dto.status,
          note: dto.note ?? null,
        },
      });

      return updatedTicket;
    });
  }

  private async employeeOrThrow(userId: string): Promise<Employee> {
    const employee = await prisma.employee.findUnique({
      where: {
        id: userId,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${userId} not found`);
    }

    return employee;
  }

  private checkStatusChangeAllowed(
    fromStatus: TicketStatus,
    toStatus: TicketStatus,
  ) {
    return this.transitions[fromStatus].includes(toStatus);
  }

  private async ticketOrThrow(id: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }
}
