import { BaseError } from './base-error';

export class ApplicationError extends BaseError {
  constructor(message: string, code: string = 'APPLICATION_ERROR', cause?: Error) {
    super({ message, code, statusCode: 400, cause });
  }
}
