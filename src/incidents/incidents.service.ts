import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from 'src/incident-logs/incident-logs.service';
import { IncidentAcknowledgeService } from 'src/incident-acknowledge/incident-acknowledge.service';
import { AcknoledgeIncidentDto } from 'src/incident-acknowledge/dto/acknowledge-incident.dto';
import {
  IncidentLog,
  IncidentLogType,
} from 'src/incident-logs/incident-logs.types';
import { prisma } from 'src/lib/prisma';
import { Employee, Incident, IncidentStatus } from 'generated/prisma/client';

@Injectable()
export class IncidentsService {
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

  constructor(
    private readonly incidentLogsService: IncidentLogsService,
    private readonly incidentAcknowledge: IncidentAcknowledgeService,
  ) {}

  async create(dto: CreateIncidentDto): Promise<Incident> {
    const incident = await prisma.incident.create({
      data: dto,
    });

    return incident;
  }

  addToIncidents(dto: Incident) {}

  async getIncidents() {
    return prisma.incident.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async acknowledgeIncident(
    id: string,
    dto: AcknoledgeIncidentDto,
    userId: string,
  ) {
    // check if incident exists
    const incident = await this.incidentOrThrow(id);

    // check if incident was already acknowledged
    const alreadyAcknowledged = incident.acknowledgedAt !== null;
    if (alreadyAcknowledged) {
      throw new BadRequestException('Incident has been already acknowledged');
    }
    // check incident status
    const incidentStatus = incident.status;

    // returns true or false
    const isAllowedAcknowledge =
      this.incidentAcknowledge.allowedAcknowledgeCheck(incidentStatus);

    if (!isAllowedAcknowledge) {
      throw new BadRequestException(
        `Acknoledgement of the incident is not allowed with current status : ${incidentStatus}`,
      );
    }

    const employee = await this.employeeOrThrow(userId);
    //  returns acknowledgeBy, acknowledgeAt, and optional acknowledgedNote
    const ackUpdatedValues = this.incidentAcknowledge.acknowledge(dto);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.incident.updateMany({
        where: { id, acknowledgedAt: null },
        data: {
          acknowledgedByEmployeeId: employee.id,
          acknowledgedAt: ackUpdatedValues.acknowledgedAt,
          acknowledgedNote: ackUpdatedValues.acknowledgedNote ?? null,
        },
      });

      if (updated.count === 0) {
        throw new BadRequestException('Incident already acknowledged');
      }

      const updatedIncident = await tx.incident.findUniqueOrThrow({
        where: { id },
      });

      await tx.incidentLog.create({
        data: {
          incidentId: incident.id,
          eventType: 'ACKNOWLEDGED',
          byEmployeeId: employee.id,
          fromStatus: incident.status,
          toStatus: incident.status,
          note: ackUpdatedValues.acknowledgedNote ?? null,
        },
      });
      return updatedIncident;
    });
  }

  // updateIncidentStatus(id: string, dto: UpdateIncidentStatusDto, by: string) {
  //   const foundReportIndex = this.getIndexOrThrow(id);

  //   //else if found
  //   const foundReport = this.getIncidentReportByIndex(foundReportIndex);
  //   // check if the desired status can be modified
  //   const allowedChange = this.checkStatusChangeAllowed(
  //     foundReport.status,
  //     dto.status,
  //   );

  //   if (!allowedChange) {
  //     throw new BadRequestException(
  //       `Change of status is not allowed from ${foundReport.status} to ${dto.status}`,
  //     );
  //   }
  //   const fromStatus = foundReport.status;

  //   // change status
  //   this.updatedIncidentStatus(foundReportIndex, dto.status);

  //   // update the updateAt
  //   this.updateIncidentTimestamp(foundReportIndex);

  //   //log helper
  //   this.logStatusChange(foundReport.id, fromStatus, dto.status, dto, by);

  //   return this.incidents[foundReportIndex];
  // }

  // getAcknowledgments(id: string) {
  //   this.getIncidentById(id);
  //   return this.incidentLogsService.listByIdAcknowledged(id);
  // }

  // getLogs(id: string, type?: IncidentLogType): IncidentLog[] {
  //   this.getIncidentById(id);
  //   return this.incidentLogsService.listByIncidentId(id, type);
  // }

  async getIncidentById(id: string): Promise<Incident> {
    const incident = await this.incidentOrThrow(id);
    return incident;
  }

  private async employeeOrThrow(userId: string): Promise<Employee> {
    const employee = await prisma.employee.findUnique({
      where: {
        id: userId,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${userId} not found`);
    }

    return employee;
  }

  private async incidentOrThrow(id: string): Promise<Incident> {
    const incident = await prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }

    return incident;
  }

  // private logStatusChange(
  //   incidentId: string,
  //   fromStatus: IncidentStatus,
  //   toStatus: IncidentStatus,
  //   dto: UpdateIncidentStatusDto,
  //   by: string,
  // ) {
  //   const payload = {
  //     incidentId,
  //     fromStatus,
  //     toStatus,
  //     by,
  //     note: dto.note,
  //   };

  //   this.incidentLogsService.appendStatusChange(payload);
  // }

  //so make this return index or throw

  // private updateIncidentTimestamp(idx: number) {
  //   this.incidents[idx].updatedAt = new Date().toISOString();
  // }

  // private getIncidentReportByIndex(idx: number) {
  //   return this.incidents[idx];
  // }

  // private updatedIncidentStatus(idx: number, toStatus: IncidentStatus) {
  //   this.incidents[idx].status = toStatus;
  // }

  // private checkStatusChangeAllowed(
  //   fromStatus: IncidentStatus,
  //   toStatus: IncidentStatus,
  // ) {
  //   return this.transitions[fromStatus].includes(toStatus);
  // }
}
