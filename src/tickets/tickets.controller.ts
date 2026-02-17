import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ITGuard } from 'src/common/it/it.guard';
import { TicketStatus } from './tickets.types';
import { AuthenticatedRequest } from 'src/types/authenticated-request.type';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

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

  @Patch(':id/status')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  updateTicketStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    const by = req.user.email;
    return this.ticketsService.updateStatus({ id, dto, by });
  }

  @Delete(':id')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  deleteTicket() {}
}
