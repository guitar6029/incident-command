import { IncidentStatus, Severity } from '../incidents.types';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsISO8601,
} from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  title: string;

  @IsEnum(Severity)
  severity: Severity;

  @IsEmail()
  reportedBy: string;

  @IsString()
  @IsOptional()
  summary?: string;
}
