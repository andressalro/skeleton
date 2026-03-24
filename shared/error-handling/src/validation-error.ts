import { BaseError } from './base-error';

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends BaseError {
  readonly fieldErrors: FieldError[];

  constructor(
    message: string = 'Validation failed',
    fieldErrors: FieldError[] = [],
    code: string = 'VALIDATION_ERROR',
  ) {
    super({ message, code, statusCode: 400 });
    this.fieldErrors = fieldErrors;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      fieldErrors: this.fieldErrors,
    };
  }
}
