import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AssignTicketDto {
  @IsNotEmpty()
  @IsEmail()
  actorEmail: string;

  @IsOptional()
  assigneeEmail?: string;
}
