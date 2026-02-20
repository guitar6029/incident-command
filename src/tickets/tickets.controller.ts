import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthenticatedRequest } from 'src/types/authenticated-request.type';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketLogsService } from 'src/ticket-logs/ticket-logs.service';
import { TicketLogType } from 'src/ticket-logs/ticket-logs.types';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketAssignmentService } from 'src/ticket-assignment/ticket-assignment.service';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly ticketLogService: TicketLogsService,
    private readonly ticketAssignmentService: TicketAssignmentService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  getTickets() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  getTicketById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketService.findById(id);
  }

  @Get(':id/logs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  getTicketLogReportById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('type', new ParseEnumPipe(TicketLogType, { optional: true }))
    type?: TicketLogType,
  ) {
    this.ticketService.findById(id);
    return this.ticketLogService.listByTicketId(id, type);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  createTicket(@Body() dto: CreateTicketDto) {
    return this.ticketService.create(dto);
  }

  @Post(':id/assign')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  assignTicket(
    @Param('id', new ParseUUIDPipe()) ticketId: string,
    @Body() dto: AssignTicketDto,
  ) {
    return this.ticketAssignmentService.assignTicket(ticketId, dto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  updateTicketStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    const by = req.user.email;
    return this.ticketService.updateStatus({ id, dto, by });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  deleteTicketById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketService.deleteTicketById(id);
  }
}
