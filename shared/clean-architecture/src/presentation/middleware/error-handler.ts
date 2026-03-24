import { Request, Response, NextFunction } from 'express';
import { BaseError, ValidationError } from '@shared/error-handling';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      ok: false,
      error: err.message,
      code: err.code,
      fieldErrors: err.fieldErrors,
    });
    return;
  }

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      ok: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  res.status(500).json({
    ok: false,
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
  });
}
