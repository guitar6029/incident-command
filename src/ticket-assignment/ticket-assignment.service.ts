import { Injectable, NotImplementedException } from '@nestjs/common';
import { AssignTicketDto } from 'src/tickets/dto/assign-ticket.dto';

@Injectable()
export class TicketAssignmentService {
  assignTicket(id: string, dto: AssignTicketDto) {
    //todo
    // assigns the ticket to the given it staff (based on id)
    // check if staff exists
    // call the ticket logger
    throw new NotImplementedException(
      'Ticket assignment workflow not implemented yet',
    );
  }
}
