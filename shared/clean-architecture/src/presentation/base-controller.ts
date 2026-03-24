import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  protected abstract executeImpl(req: Request, res: Response, next: NextFunction): Promise<void>;

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeImpl(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  protected ok<T>(res: Response, data?: T): Response {
    if (data !== undefined) {
      return res.status(200).json({ ok: true, data });
    }
    return res.sendStatus(200);
  }

  protected created<T>(res: Response, data?: T): Response {
    if (data !== undefined) {
      return res.status(201).json({ ok: true, data });
    }
    return res.sendStatus(201);
  }

  protected noContent(res: Response): Response {
    return res.sendStatus(204);
  }

  protected clientError(res: Response, message: string = 'Bad request'): Response {
    return res.status(400).json({ ok: false, error: message, code: 'BAD_REQUEST' });
  }

  protected unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return res.status(401).json({ ok: false, error: message, code: 'UNAUTHORIZED' });
  }

  protected forbidden(res: Response, message: string = 'Forbidden'): Response {
    return res.status(403).json({ ok: false, error: message, code: 'FORBIDDEN' });
  }

  protected notFound(res: Response, message: string = 'Not found'): Response {
    return res.status(404).json({ ok: false, error: message, code: 'NOT_FOUND' });
  }

  protected conflict(res: Response, message: string = 'Conflict'): Response {
    return res.status(409).json({ ok: false, error: message, code: 'CONFLICT' });
  }

  protected fail(res: Response, error: Error | string): Response {
    const message = error instanceof Error ? error.message : error;
    return res.status(500).json({ ok: false, error: message, code: 'INTERNAL_ERROR' });
  }
}
