export class ErrorResponse {
  readonly ok = false;
  readonly error: string;
  readonly code: string;
  readonly details?: unknown;

  constructor(error: string, code: string, details?: unknown) {
    this.error = error;
    this.code = code;
    this.details = details;
  }

  static of(error: string, code: string, details?: unknown): ErrorResponse {
    return new ErrorResponse(error, code, details);
  }

  toJSON() {
    return {
      ok: this.ok,
      error: this.error,
      code: this.code,
      ...(this.details !== undefined && { details: this.details }),
    };
  }
}
