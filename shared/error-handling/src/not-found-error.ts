import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super({ message, code, statusCode: 404 });
  }
}
