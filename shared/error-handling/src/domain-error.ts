import { BaseError } from './base-error';

export class DomainError extends BaseError {
  readonly params?: Record<string, string | number | boolean>;

  constructor(
    message: string,
    code: string = 'DOMAIN_ERROR',
    params?: Record<string, string | number | boolean>,
    cause?: Error,
  ) {
    super({ message, code, statusCode: 422, cause });
    this.params = params;
  }

  serialize() {
    return {
      type: 'DOMAIN_ERROR',
      name: this.name,
      code: this.code,
      message: this.message,
      params: this.params,
    };
  }
}
