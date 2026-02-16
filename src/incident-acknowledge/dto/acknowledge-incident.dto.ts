import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AcknoledgeIncidentDto {
  @IsEmail()
  @IsNotEmpty()
  by: string;

  @IsOptional()
  @IsString()
  note?: string;
}
