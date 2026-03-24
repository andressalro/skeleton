import { BaseError } from './base-error';

export class DomainError extends BaseError {
  constructor(message: string, code: string = 'DOMAIN_ERROR', cause?: Error) {
    super({ message, code, statusCode: 422, cause });
  }
}
