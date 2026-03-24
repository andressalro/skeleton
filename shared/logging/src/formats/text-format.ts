import { LoggerOptions } from 'pino';

/**
 * Text format for local development.
 * Uses pino-pretty transport for human-readable output.
 */
export function textFormat(serviceName: string): LoggerOptions {
  return {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss.l',
        ignore: 'pid,hostname',
        messageFormat: `[${serviceName}] {msg}`,
      },
    },
  };
}
