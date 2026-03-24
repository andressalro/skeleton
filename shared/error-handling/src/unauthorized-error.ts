import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super({ message, code, statusCode: 401 });
  }
}
