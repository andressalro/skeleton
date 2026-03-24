import { LoggerOptions } from 'pino';

/**
 * JSON format suitable for Lambda/CloudWatch structured logging.
 * Outputs one JSON line per log entry — no pretty printing.
 */
export function jsonFormat(serviceName: string): LoggerOptions {
  return {
    formatters: {
      level(label) {
        return { level: label };
      },
      bindings(bindings) {
        return { service: serviceName, pid: bindings.pid, hostname: bindings.hostname };
      },
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    messageKey: 'message',
  };
}
