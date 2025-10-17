/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>() as any;
    const start = Date.now();
    const method = req?.method;
    const url = req?.url;

    return next.handle().pipe(
      tap({
        next: () => {},
        error: (err) => {
          const status = (err?.status as number) ?? 500;
          console.log(
            JSON.stringify({
              level: 'error',
              method,
              url,
              status,
              ms: Date.now() - start,
              msg: err?.message,
            }),
          );
        },
        complete: () => {
          const res = context.switchToHttp().getResponse<Response>() as any;
          const status = res?.statusCode ?? 200;

          console.log(
            JSON.stringify({ level: 'info', method, url, status, ms: Date.now() - start }),
          );
        },
      }),
    );
  }
}
