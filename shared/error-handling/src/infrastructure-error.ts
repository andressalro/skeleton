import { BaseError } from './base-error';

export class InfrastructureError extends BaseError {
  constructor(message: string, code: string = 'INFRASTRUCTURE_ERROR', cause?: Error) {
    super({ message, code, statusCode: 500, cause });
  }
}
