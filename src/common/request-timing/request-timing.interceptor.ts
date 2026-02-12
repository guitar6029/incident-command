import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const startTime = Date.now();
    //return next.handle();
    return next.handle().pipe(
      finalize(() => {
        const endTime = Date.now();
        this.logger.log(`${method} ${url} - ${endTime - startTime}ms`);
      }),
    );
  }
}
