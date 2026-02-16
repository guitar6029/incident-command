import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  getTickets() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  getTicketById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketsService.findById(id);
  }

  @Post()
  createTicket(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Patch(':id')
  updateTicket() {}

  @Delete(':id')
  deleteTicket() {}
}
