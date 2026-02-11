import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { randomUUID } from 'crypto';
import { IncidentCase, IncidentStatus } from './incidents.types';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from 'src/incident-logs/incident-logs.service';

@Injectable()
export class IncidentsService {
  private incidents: IncidentCase[] = [];
  private readonly transitions: Record<IncidentStatus, IncidentStatus[]> = {
    [IncidentStatus.OPEN]: [
      IncidentStatus.IN_PROGRESS,
      IncidentStatus.CANCELLED,
    ],

    [IncidentStatus.IN_PROGRESS]: [
      IncidentStatus.RESOLVED,
      IncidentStatus.CANCELLED,
    ],

    [IncidentStatus.RESOLVED]: [IncidentStatus.REOPENED],

    [IncidentStatus.REOPENED]: [
      IncidentStatus.IN_PROGRESS,
      IncidentStatus.CANCELLED,
    ],

    [IncidentStatus.CANCELLED]: [],
  };

  constructor(private readonly incidentLogsService: IncidentLogsService) {}

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
      updatedAt: tempTimestamp,
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

  updateIncidentStatus(id: string, dto: UpdateIncidentStatusDto) {
    const foundReportIndex = this.incidents.findIndex(
      (ir: IncidentCase) => ir.id === id,
    );
    if (foundReportIndex === -1) {
      throw new NotFoundException('Incident report not found');
    }
    //else if found
    const foundReport = this.getIncidentReportByIndex(foundReportIndex);
    // check if the desired status can be modified
    const allowedChange = this.checkStatusChangeAllowed(
      foundReport.status,
      dto.status,
    );

    if (!allowedChange) {
      throw new BadRequestException(
        `Change of status is not allowed from ${foundReport.status} to ${dto.status}`,
      );
    }
    const fromStatus = foundReport.status;

    // change status
    this.updatedIncidentStatus(foundReportIndex, dto.status);

    // update the updateAt
    this.updateIncidentTimestamp(foundReportIndex);

    //log helper
    this.logStatusChange(foundReport.id, fromStatus, dto.status, dto);

    return this.incidents[foundReportIndex];
  }

  private logStatusChange(
    incidentId: string,
    fromStatus: IncidentStatus,
    toStatus: IncidentStatus,
    dto: UpdateIncidentStatusDto,
  ) {
    const payload = {
      incidentId,
      fromStatus,
      toStatus,
      by: dto.by,
      note: dto.note,
    };

    this.incidentLogsService.appendStatusChange(payload);
  }

  private updateIncidentTimestamp(idx: number) {
    this.incidents[idx].updatedAt = new Date().toISOString();
  }

  private getIncidentReportByIndex(idx: number) {
    return this.incidents[idx];
  }

  private updatedIncidentStatus(idx: number, toStatus: IncidentStatus) {
    this.incidents[idx].status = toStatus;
  }

  private checkStatusChangeAllowed(
    fromStatus: IncidentStatus,
    toStatus: IncidentStatus,
  ) {
    return this.transitions[fromStatus].includes(toStatus);
  }
}
