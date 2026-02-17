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
import { ITGuard } from 'src/common/it/it.guard';
import { AuthenticatedRequest } from 'src/types/authenticated-request.type';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketLogsService } from 'src/ticket-logs/ticket-logs.service';
import { TicketLogType } from 'src/ticket-logs/ticket-logs.types';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly ticketsLogService: TicketLogsService,
  ) {}

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

  @Get(':id/logs')
  @UseGuards(ITGuard)
  @Roles('IT_HELP')
  getTicketLogReportById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('type', new ParseEnumPipe(TicketLogType, { optional: true }))
    type?: TicketLogType,
  ) {
    this.ticketsService.findById(id);
    return this.ticketsLogService.listByTicketId(id, type);
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
  deleteTicketById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketsService.deleteTicketById(id);
  }
}
