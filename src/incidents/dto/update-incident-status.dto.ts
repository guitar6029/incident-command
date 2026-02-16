import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from '../incidents.types';

export class UpdateIncidentStatusDto {
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
