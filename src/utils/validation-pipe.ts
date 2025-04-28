import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors = this.formatValidationErrors(errors);
      throw new BadRequestException(formattedErrors);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatValidationErrors(errors: ValidationError[]) {
    const formattedErrors: Record<string, string> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        // Take the first constraint message
        const firstMessage = Object.values(error.constraints)[0];
        formattedErrors[error.property] = firstMessage;
      }
    });

    return { errors: formattedErrors };
  }
}
