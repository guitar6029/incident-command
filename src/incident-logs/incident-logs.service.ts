import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';
import { IncidentLog, IncidentLogType } from 'generated/prisma/client';

@Injectable()
export class IncidentLogsService {
  async listByAcknowledged(): Promise<IncidentLog[]> {
    return prisma.incidentLog.findMany({
      where: {
        eventType: IncidentLogType.ACKNOWLEDGED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listByIdAcknowledged(id: string): Promise<IncidentLog[]> {
    return prisma.incidentLog.findMany({
      where: {
        incidentId: id,
        eventType: IncidentLogType.ACKNOWLEDGED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listByIncidentId(
    incidentId: string,
    incidentType?: IncidentLogType,
  ): Promise<IncidentLog[]> {
    return prisma.incidentLog.findMany({
      where: {
        incidentId,
        ...(incidentType ? { eventType: incidentType } : {}),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
