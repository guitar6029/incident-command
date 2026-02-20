import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.ref.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Forbidden');
    }

    // oncall check
    if (requiredRoles.includes('ONCALL') && !user.onCall) {
      throw new ForbiddenException('Forbidden');
    }
    // IT_HELP role check
    if (requiredRoles.includes('IT_HELP') && user.role !== 'IT_HELP') {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
