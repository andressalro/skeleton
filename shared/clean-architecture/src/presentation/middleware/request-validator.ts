import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidatorOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function requestValidator(schemas: ValidatorOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'body'));
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'query'));
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'params'));
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        ok: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fieldErrors: errors,
      });
      return;
    }

    next();
  };
}

function formatZodErrors(error: ZodError, source: string): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: `${source}.${issue.path.join('.')}`,
    message: issue.message,
  }));
}
