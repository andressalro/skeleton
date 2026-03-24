import { BaseError } from './base-error';
import { DomainError } from './domain-error';
import { ApplicationError } from './application-error';
import { InfrastructureError } from './infrastructure-error';
import { NotFoundError } from './not-found-error';
import { ValidationError } from './validation-error';
import { UnauthorizedError } from './unauthorized-error';

describe('BaseError', () => {
  it('should have correct name, code, message and statusCode', () => {
    const error = new DomainError('Business rule violated', 'BUSINESS_RULE');
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Business rule violated');
    expect(error.code).toBe('BUSINESS_RULE');
    expect(error.statusCode).toBe(422);
    expect(error instanceof Error).toBe(true);
    expect(error instanceof BaseError).toBe(true);
  });

  it('should serialize to JSON correctly', () => {
    const error = new NotFoundError('User not found');
    const json = error.toJSON();
    expect(json).toEqual({
      name: 'NotFoundError',
      code: 'NOT_FOUND',
      message: 'User not found',
      statusCode: 404,
    });
  });

  it('should preserve the original cause', () => {
    const original = new Error('DB connection lost');
    const error = new InfrastructureError('Database error', 'DB_ERROR', original);
    expect(error.cause).toBe(original);
  });
});

describe('Error hierarchy', () => {
  it('DomainError should have statusCode 422', () => {
    const error = new DomainError('Invalid state');
    expect(error.statusCode).toBe(422);
  });

  it('ApplicationError should have statusCode 400', () => {
    const error = new ApplicationError('Use case failed');
    expect(error.statusCode).toBe(400);
  });

  it('InfrastructureError should have statusCode 500', () => {
    const error = new InfrastructureError('External API failed');
    expect(error.statusCode).toBe(500);
  });

  it('NotFoundError should have statusCode 404', () => {
    const error = new NotFoundError('Resource not found');
    expect(error.statusCode).toBe(404);
  });

  it('ValidationError should have statusCode 400 and carry field errors', () => {
    const error = new ValidationError('Invalid input', [
      { field: 'email', message: 'Invalid email format' },
    ]);
    expect(error.statusCode).toBe(400);
    expect(error.fieldErrors).toHaveLength(1);
    expect(error.fieldErrors[0].field).toBe('email');
  });

  it('UnauthorizedError should have statusCode 401', () => {
    const error = new UnauthorizedError('Not authenticated');
    expect(error.statusCode).toBe(401);
  });
});
