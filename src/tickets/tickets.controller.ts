import {
  Body,
  Controller,
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
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketAssignmentService } from 'src/ticket-assignment/ticket-assignment.service';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { TicketLogType } from 'generated/prisma/enums';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
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
    return this.ticketService.getTicketById(id);
  }

  @Get(':id/logs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  async getTicketLogReportById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('type', new ParseEnumPipe(TicketLogType, { optional: true }))
    type?: TicketLogType,
  ) {
    return this.ticketService.getTicketLogById(id, type);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  async createTicket(
    @Body() dto: CreateTicketDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.ticketService.create(userId, dto);
  }

  @Post(':id/assign')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  assignTicket(
    @Param('id', new ParseUUIDPipe()) ticketId: string,
    @Body() dto: AssignTicketDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.ticketAssignmentService.assignTicket(ticketId, dto, userId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  async updateTicketStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    const userId = req.user.id;
    return this.ticketService.updateStatus({ id, dto, userId });
  }
}
