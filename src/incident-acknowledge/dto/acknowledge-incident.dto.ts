import { IsOptional, IsString } from 'class-validator';

export class AcknoledgeIncidentDto {
  @IsOptional()
  @IsString()
  note?: string;
}
