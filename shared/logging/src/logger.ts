import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import { LogLevel } from './log-level';
import { jsonFormat } from './formats/json-format';
import { textFormat } from './formats/text-format';

export interface Logger {
  error(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): Logger;
}

export interface CreateLoggerOptions {
  serviceName: string;
  level?: LogLevel;
  pretty?: boolean;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const { serviceName, level = LogLevel.INFO, pretty = false } = options;

  const formatOptions: LoggerOptions = pretty
    ? textFormat(serviceName)
    : jsonFormat(serviceName);

  const pinoInstance = pino({
    level,
    ...formatOptions,
  });

  return wrapPino(pinoInstance);
}

function wrapPino(instance: PinoLogger): Logger {
  return {
    error(message: string, context?: Record<string, unknown>) {
      context ? instance.error(context, message) : instance.error(message);
    },
    warn(message: string, context?: Record<string, unknown>) {
      context ? instance.warn(context, message) : instance.warn(message);
    },
    info(message: string, context?: Record<string, unknown>) {
      context ? instance.info(context, message) : instance.info(message);
    },
    debug(message: string, context?: Record<string, unknown>) {
      context ? instance.debug(context, message) : instance.debug(message);
    },
    child(bindings: Record<string, unknown>): Logger {
      return wrapPino(instance.child(bindings));
    },
  };
}
