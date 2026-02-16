import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

const EMAIL_DOMAIN = 'it-help.com';

@Injectable()
export class ITGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const email = req.headers['x-user-email'];

    const requiredRoles = this.ref.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    if (requiredRoles.includes('IT_HELP')) {
      if (!email) {
        throw new UnauthorizedException('Requires a valid email');
      }
      const emailValue = Array.isArray(email)
        ? email[0].trim().toLowerCase()
        : email.trim().toLowerCase();
      const parts = emailValue.split('@');
      if (parts.length !== 2) {
        throw new UnauthorizedException('Invalid email format');
      }
      const domain = parts[1];
      if (domain !== EMAIL_DOMAIN) {
        throw new ForbiddenException('Insufficient permissions');
      }
      // set the email
      req.user = { email: emailValue };
    }

    return true;
  }
}
