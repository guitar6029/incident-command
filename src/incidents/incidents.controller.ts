import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

@Controller('incidents')
@UseInterceptors(RequestTimingInterceptor)
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentLogService: IncidentLogsService,
  ) {}
  @Get()
  getIncidentReports(): IncidentCase[] {
    return this.incidentsService.getIncidents();
  }

  @Get(':id')
  getIncidentById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.incidentsService.getIncidentById(id);
  }

  @Get(':id/logs')
  getIncidentLogReportById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.incidentLogService.listByIncidentId(id);
  }

  @Post()
  createIncidentReport(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(OncallGuard)
  @Roles('ONCALL')
  updateIncidentReportStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dtoPatch: UpdateIncidentStatusDto,
  ): IncidentCase {
    return this.incidentsService.updateIncidentStatus(id, dtoPatch);
  }
}
