import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { EmployeeRole } from '../employees.types';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsInt()
  @Min(1)
  @Max(3)
  level: 1 | 2 | 3;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  onCall: boolean;
}
