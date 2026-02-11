import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';
import { IncidentCase } from './incidents.types';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from 'src/incident-logs/incident-logs.service';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentLogService: IncidentLogsService,
  ) {}
  @Get()
  getIncidentReports(): IncidentCase[] {
    return this.incidentsService.getIncidents();
  }

  @Get('/:id/logs')
  getIncidentLogReportById(@Param('id') id: string) {
    return this.incidentLogService.listByIncidentId(id);
  }

  @Post()
  createIncidentReport(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Patch(':id/status')
  updateIncidentReportStatus(
    @Param('id') id: string,
    @Body() dtoPatch: UpdateIncidentStatusDto,
  ): IncidentCase {
    return this.incidentsService.updateIncidentStatus(id, dtoPatch);
  }
}
