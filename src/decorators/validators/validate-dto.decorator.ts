// validate-dto.decorator.ts
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * DTO validator for functions/methods
 * @param {Function} dtoClass : Any dto class object
 * @param {Object} options: Options
 * @param {string} options.property: Property accessor for nested objects
 * @param {number} options.argIndex: Argument index on the function
 */
export function ValidateDto(
  dtoClass: any,
  options?: { property?: string; argIndex?: number },
) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const argIndex = options?.argIndex ?? 0;
      const arg = args[argIndex];
      if (arg == null || typeof arg !== 'object') {
        throw new Error(`Argument supplied at index ${argIndex} is invalid.`);
      }
      const dtoObject = plainToInstance(dtoClass, arg);
      const errors = await validate(
        options?.property ? dtoObject?.[options?.property] : dtoObject,
      );

      if (errors.length > 0) {
        throw new BadRequestException(
          errors.map((error) => Object.values(error.constraints)).join(', '),
        );
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
