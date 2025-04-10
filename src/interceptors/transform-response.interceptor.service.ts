import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, { status: boolean; data: T }>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ status: boolean; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        status: !!data,
        message: 'Successfully',
        ...data,
      })),
    );
  }
}
