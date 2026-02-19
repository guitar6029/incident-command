import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from 'generated/prisma/enums';

export class UpdateIncidentStatusDto {
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
