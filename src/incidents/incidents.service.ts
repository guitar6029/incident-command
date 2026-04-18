import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentLogsService } from '../incident-logs/incident-logs.service';
import { IncidentAcknowledgeService } from '../incident-acknowledge/incident-acknowledge.service';
import { AcknoledgeIncidentDto } from '../incident-acknowledge/dto/acknowledge-incident.dto';
import { IncidentLog, IncidentLogType } from '../../generated/prisma/client';
import { prisma } from '../lib/prisma';
import {
  Employee,
  Incident,
  IncidentStatus,
} from '../../generated/prisma/client';

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

  async updateIncidentStatus(
    id: string,
    dto: UpdateIncidentStatusDto,
    userId: string,
  ) {
    // check if incident exists
    const incident = await this.incidentOrThrow(id);

    // check incident status
    const incidentStatus = incident.status;

    const isAllowedToUpdateStatus = this.checkStatusChangeAllowed(
      incidentStatus,
      dto.status,
    );

    if (!isAllowedToUpdateStatus) {
      throw new BadRequestException(
        `Change of status is not allowed from ${incident.status} to ${dto.status}`,
      );
    }

    const employee = await this.employeeOrThrow(userId);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.incident.updateMany({
        where: {
          id,
          status: incident.status,
        },
        data: {
          status: dto.status,
        },
      });

      if (updated.count === 0) {
        throw new BadRequestException(
          'Incident status was modified by another request',
        );
      }

      const updatedIncident = await tx.incident.findUniqueOrThrow({
        where: { id },
      });

      await tx.incidentLog.create({
        data: {
          incidentId: id,
          eventType: 'STATUS_CHANGED',
          byEmployeeId: employee.id,
          fromStatus: incidentStatus,
          toStatus: dto.status,
          note: dto.note ?? null,
        },
      });
      return updatedIncident;
    });
  }

  async getLogs(id: string, type?: IncidentLogType): Promise<IncidentLog[]> {
    await this.getIncidentById(id);
    return this.incidentLogsService.listByIncidentId(id, type);
  }

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

  private checkStatusChangeAllowed(
    fromStatus: IncidentStatus,
    toStatus: IncidentStatus,
  ) {
    return this.transitions[fromStatus].includes(toStatus);
  }
}
