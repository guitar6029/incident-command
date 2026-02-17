import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeRole } from './employees.types';

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];

  create(dto: CreateEmployeeDto): Employee {
    const exists = this.employees.some(
      (e) => e.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (exists)
      throw new BadRequestException('Employee with this email already exists');

    const now = new Date().toISOString();
    const employee: Employee = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email.toLowerCase(),
      role: dto.role,
      level: dto.level,
      active: dto.active,
      onCall: dto.onCall,
      createdAt: now,
      updatedAt: now,
    };

    this.employees.push(employee);
    return employee;
  }

  findAll(): Employee[] {
    return this.employees;
  }

  findOne(id: string): Employee {
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  update(id: string, dto: UpdateEmployeeDto): Employee {
    const emp = this.findOne(id);

    if (dto.email && dto.email.toLowerCase() !== emp.email) {
      const exists = this.employees.some(
        (e) => e.email === dto.email!.toLowerCase() && e.id !== id,
      );
      if (exists)
        throw new BadRequestException(
          'Employee with this email already exists',
        );
    }

    const updated: Employee = {
      ...emp,
      ...dto,
      email: dto.email ? dto.email.toLowerCase() : emp.email,
      updatedAt: new Date().toISOString(),
    };

    this.employees = this.employees.map((e) => (e.id === id ? updated : e));
    return updated;
  }

  remove(id: string): { deleted: true } {
    this.findOne(id);
    this.employees = this.employees.filter((e) => e.id !== id);
    return { deleted: true };
  }

  // ---- helpers for TicketAssignmentService later ----

  findByEmail(email: string): Employee | undefined {
    return this.employees.find((e) => e.email === email.toLowerCase());
  }

  findActiveByEmail(email: string): Employee | undefined {
    const emp = this.findByEmail(email);
    if (!emp || !emp.active) return undefined;
    return emp;
  }

  listAssignable(): Employee[] {
    return this.employees.filter(
      (e) =>
        e.active &&
        e.onCall &&
        (e.role === EmployeeRole.IT_HELP ||
          e.role === EmployeeRole.SYSTEM ||
          e.role === EmployeeRole.NETWORK ||
          e.role === EmployeeRole.SRE),
    );
  }
}
