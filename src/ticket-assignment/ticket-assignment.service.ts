import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignTicketDto } from 'src/tickets/dto/assign-ticket.dto';
import { prisma } from 'src/lib/prisma';
import { Ticket, TicketLogType } from 'generated/prisma/client';
@Injectable()
export class TicketAssignmentService {
  async assignTicket(
    id: string,
    dto: AssignTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }

    const employee = await prisma.employee.findUniqueOrThrow({
      where: { id: dto.assigneeId },
    });

    return prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.update({
        where: {
          id,
        },
        data: {
          assignedToEmployeeId: dto.assigneeId,
          updatedByEmployeeId: userId,
        },
      });

      await tx.ticketLog.create({
        data: {
          ticketId: id,
          eventType: TicketLogType.ASSIGNED,
          byEmployeeId: userId,
          fromStatus: ticket.status,
          toStatus: ticket.status,
          note: `Assigned to ${employee.name} (${employee.role})`,
        },
      });
      return updatedTicket;
    });
  }
}
