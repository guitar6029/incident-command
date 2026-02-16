import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OncallGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const email = req.headers['x-user-email'];
    const requiredRoles = this.ref.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
      return true;
    }

    if (requiredRoles.includes('ONCALL')) {
      //chech if null or undefined
      if (!email) {
        throw new UnauthorizedException('Requires a valid email');
      }

      //grab the email from array or string and get rid of the white spaces
      let emailValue = Array.isArray(email) ? email[0].trim() : email.trim();
      if (emailValue !== 'oncall@company.com') {
        throw new ForbiddenException(
          'This email does not have enough permission to modify/cancel incidents',
        );
      }

      // set the email
      req.user = { email: emailValue };
    }

    return true;
  }
}
