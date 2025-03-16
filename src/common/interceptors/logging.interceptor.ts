import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    const start = Date.now();
    this.logger.log(
      `Incoming request: ${method} ${url} | Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - start;
        this.logger.log(
          `Response: ${method} ${url} | Status: 200 | Duration: ${duration}ms`,
        );
      }),
    );
  }
}
