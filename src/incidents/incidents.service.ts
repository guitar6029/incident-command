import { Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { randomUUID } from 'crypto';
import { IncidentCase, IncidentStatus } from './incidents.types';

@Injectable()
export class IncidentsService {
  private incidents: IncidentCase[] = [];

  create(dto: CreateIncidentDto) {
    //temp timestamp
    const tempTimestamp = new Date().toISOString();

    const id = randomUUID();

    // add to the incidentes (in mmemory for now)
    const dtoIncident = {
      id,
      ...dto,
      status: IncidentStatus.OPEN,
      createdAt: tempTimestamp,
    };

    //push to list
    this.addToIncidents(dtoIncident);

    return dtoIncident;
  }

  addToIncidents(dto: IncidentCase) {
    this.incidents.push(dto);
  }

  getIncidents() {
    return this.incidents;
  }
}
