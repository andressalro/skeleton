import { Credentials } from './Credentials'

export abstract class Connection {
  public readonly workspaceId

  constructor(
    workspaceId: string,
    public readonly credentials: Credentials
  ) {
    this.workspaceId = workspaceId || 'public'
  }

  abstract connect(): Promise<boolean>
  abstract disconnect(): Promise<void>
  abstract getConectionIdentifier(): string
  abstract execute<T extends Record<string, unknown>>(
    query: string
  ): Promise<T[]>
}
