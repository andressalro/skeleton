export interface BaseErrorProps {
  message: string;
  code: string;
  statusCode: number;
  cause?: Error;
}

export abstract class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly cause?: Error;

  constructor(props: BaseErrorProps) {
    super(props.message);
    this.name = this.constructor.name;
    this.code = props.code;
    this.statusCode = props.statusCode;
    this.cause = props.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
