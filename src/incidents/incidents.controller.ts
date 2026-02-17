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
import { IncidentCase } from './incidents.types';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from 'src/incident-logs/incident-logs.service';
import { RequestTimingInterceptor } from 'src/common/request-timing/request-timing.interceptor';
import { OncallGuard } from 'src/common/oncall/oncall.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AcknoledgeIncidentDto } from '../incident-acknowledge/dto/acknowledge-incident.dto';
import {
  IncidentLog,
  IncidentLogType,
} from 'src/incident-logs/incident-logs.types';
import { AuthenticatedRequest } from 'src/types/authenticated-request.type';

@Controller('incidents')
@UseInterceptors(RequestTimingInterceptor)
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentsLogService: IncidentLogsService,
  ) {}

  @Get('acknowledgments')
  getAcknowledgedLogs(): IncidentLog[] {
    return this.incidentsLogService.listByAcknowledged();
  }

  @Get(':id/acknowledgments')
  getAcknowledgedById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.incidentsService.getlistByIdAcknowledged(id);
  }

  @Get()
  getIncidentReports(): IncidentCase[] {
    return this.incidentsService.getIncidents();
  }

  @Patch(':id/acknowledgments')
  @UseGuards(OncallGuard)
  @Roles('ONCALL')
  acknowledgeIncident(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AcknoledgeIncidentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const by = req.user.email;
    // the incidentService updates the acknowledgments properties
    return this.incidentsService.acknowledgeIncident(id, dto, by);
  }

  @Get(':id')
  getIncidentById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.incidentsService.getIncidentById(id);
  }

  @Get(':id/logs')
  getIncidentLogReportById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('type', new ParseEnumPipe(IncidentLogType, { optional: true }))
    type?: IncidentLogType,
  ) {
    return this.incidentsService.getLogs(id, type);
  }

  @Post()
  @UseGuards(OncallGuard)
  @Roles('ONCALL')
  createIncidentReport(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(OncallGuard)
  @Roles('ONCALL')
  updateIncidentReportStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dtoPatch: UpdateIncidentStatusDto,
    @Req() req: AuthenticatedRequest,
  ): IncidentCase {
    const by = req.user.email;
    return this.incidentsService.updateIncidentStatus(id, dtoPatch, by);
  }
}
