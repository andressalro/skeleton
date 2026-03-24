export class SuccessResponse<T = unknown> {
  readonly ok = true;
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  static of<T>(data: T): SuccessResponse<T> {
    return new SuccessResponse(data);
  }

  toJSON() {
    return { ok: this.ok, data: this.data };
  }
}
