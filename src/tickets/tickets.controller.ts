import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ITGuard } from 'src/common/it/it.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  getTickets() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  getTicketById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketsService.findById(id);
  }

  @Post()
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  createTicket(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  updateTicket() {}

  @Delete(':id')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  deleteTicket() {}
}
