import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): object;
}

/**
 * Serialize the response data based on response DTO class.
 * Use this decorator when serialization decorators are specified in the service response class.
 */
export function ExplicitSerialize() {
  return UseInterceptors(ClassSerializerInterceptor);
}

/**
 * Serialize the response data based on the provided DTO class.
 * Use this decorator when there is required implicit class convresion between service and controller.
 * @param {ClassConstructor} dto - The Data Transfer Object (DTO) class to serialize the response data.
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  /**
   * Intercepts the execution of the current request and applies serialization to the response data.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @param {CallHandler<any>} handler - The call handler responsible for handling the current request.
   * @return {Observable<any> | Promise<Observable<any>>} - The serialized response data.
   */
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
