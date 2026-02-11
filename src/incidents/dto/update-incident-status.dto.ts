import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IncidentStatus } from '../incidents.types';

export class UpdateIncidentStatusDto {
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @IsEmail()
  @IsNotEmpty()
  by: string;

  @IsOptional()
  @IsString()
  note?: string;
}
