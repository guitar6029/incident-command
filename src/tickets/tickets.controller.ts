import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  getTickets() {}

  @Get(':id')
  getTicketById() {}

  @Post()
  createTicket(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Patch(':id')
  updateTicket() {}

  @Delete(':id')
  deleteTicket() {}
}
