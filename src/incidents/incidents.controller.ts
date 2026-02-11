import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';
import { IncidentCase } from './incidents.types';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}
  @Get()
  getIncidentReports(): IncidentCase[] {
    return this.incidentsService.getIncidents();
  }

  @Post()
  createIncidentReport(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }
}
