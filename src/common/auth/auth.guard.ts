import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { prisma } from 'src/lib/prisma';
import { EmployeeRole } from 'generated/prisma/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const emailHeader = req.headers['x-user-email'];

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    if (!emailHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const email = Array.isArray(emailHeader)
      ? emailHeader[0].trim().toLowerCase()
      : emailHeader.trim().toLowerCase();

    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee || !employee.active) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (requiredRoles.includes('IT_HELP')) {
      if (employee.role !== EmployeeRole.IT_HELP) {
        throw new ForbiddenException('Forbidden');
      }
    }

    req.user = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      onCall: employee.onCall,
    };

    return true;
  }
}
