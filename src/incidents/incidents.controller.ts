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
  UseInterceptors,
} from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from '../incident-logs/incident-logs.service';
import { RequestTimingInterceptor } from '../common/request-timing/request-timing.interceptor';
import { Roles } from '../common/decorators/roles.decorator';
import { AcknoledgeIncidentDto } from '../incident-acknowledge/dto/acknowledge-incident.dto';

import { IncidentLog, IncidentLogType } from '../../generated/prisma/client';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
import { Incident } from '../../generated/prisma/client';
import { AuthGuard } from '../common/auth/auth.guard';
import { RolesGuard } from '../common/roles/roles.guard';

@Controller('incidents')
@UseInterceptors(RequestTimingInterceptor)
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentsLogService: IncidentLogsService,
  ) {}

  /** INCIDENTS */
  @Get()
  async getIncidentReports(): Promise<Incident[]> {
    return this.incidentsService.getIncidents();
  }

  @Get(':id')
  async getIncidentById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Incident> {
    return this.incidentsService.getIncidentById(id);
  }

  @Post()
  createIncidentReport(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  /** ACKNOWLEDGEMENTS */
  @Get('acknowledgments')
  async getAcknowledgedLogs(): Promise<IncidentLog[]> {
    return this.incidentsLogService.listByAcknowledged();
  }

  @Get(':id/acknowledgments')
  async getAcknowledgedById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IncidentLog[]> {
    return this.incidentsService.getLogs(id, IncidentLogType.ACKNOWLEDGED);
  }

  @Patch(':id/acknowledgments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('IT_HELP')
  async acknowledgeIncident(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AcknoledgeIncidentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Incident> {
    const userId = req.user.id;
    // the incidentService updates the acknowledgments properties
    return this.incidentsService.acknowledgeIncident(id, dto, userId);
  }

  @Get(':id/logs')
  @UseGuards(AuthGuard)
  async getIncidentLogReportById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('type', new ParseEnumPipe(IncidentLogType, { optional: true }))
    type?: IncidentLogType,
  ): Promise<IncidentLog[]> {
    return this.incidentsService.getLogs(id, type);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ONCALL')
  async updateIncidentReportStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateIncidentStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Incident> {
    const userId = req.user.id;
    return this.incidentsService.updateIncidentStatus(id, dto, userId);
  }
}
