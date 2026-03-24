import { createLogger, Logger } from './logger';
import { LogLevel } from './log-level';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger({
      serviceName: 'test-service',
      level: LogLevel.DEBUG,
      pretty: false,
    });
  });

  it('should create a logger with all required methods', () => {
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.info).toBeInstanceOf(Function);
    expect(logger.debug).toBeInstanceOf(Function);
    expect(logger.child).toBeInstanceOf(Function);
  });

  it('should not throw when logging messages', () => {
    expect(() => logger.info('Hello world')).not.toThrow();
    expect(() => logger.error('Error occurred', { code: 'ERR_001' })).not.toThrow();
    expect(() => logger.warn('Warning', { count: 5 })).not.toThrow();
    expect(() => logger.debug('Debug info')).not.toThrow();
  });

  it('should create a child logger', () => {
    const child = logger.child({ requestId: 'abc-123' });
    expect(child).toBeDefined();
    expect(child.info).toBeInstanceOf(Function);
    expect(() => child.info('Child log')).not.toThrow();
  });

  it('should accept context objects', () => {
    expect(() =>
      logger.info('User logged in', { userId: '123', ip: '10.0.0.1' }),
    ).not.toThrow();
  });
});
