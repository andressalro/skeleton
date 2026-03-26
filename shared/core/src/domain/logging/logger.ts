export interface Logger {
  info(...messages: string[]): void
  warn(...messages: string[]): void
  error(...messages: string[]): void
  debug(...messages: string[]): void
  withContext(context: LoggerContext): Logger
}

export type LoggerContext = {
  traceId?: string
  userId?: string
  workspaceId?: string
}
