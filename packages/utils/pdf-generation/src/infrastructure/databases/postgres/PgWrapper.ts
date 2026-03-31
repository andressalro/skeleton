import { Pool, PoolConfig, QueryResultRow } from 'pg'

import { Connection } from './Connection'
import { Credentials } from './Credentials'

export class PgWrapper extends Connection {
  private static instances: Map<string, PgWrapper> = new Map()

  private readonly client: Pool

  private constructor(workspaceId: string, credentials: Credentials) {
    super(workspaceId, credentials)
    this.client = new Pool(credentials as PoolConfig)
  }

  static getInstance(workspaceId: string, credentials: Credentials): PgWrapper {
    const instanceKey = `${workspaceId || 'public'}:${credentials.host}:${credentials.database || 'payroll'}`
    let instance = PgWrapper.instances.get(instanceKey)

    if (!instance) {
      instance = new PgWrapper(workspaceId, credentials)
      PgWrapper.instances.set(instanceKey, instance)
      console.log(
        `CONNECTED TO POSTGRES HOST=>${credentials.host}, WC=>'${workspaceId}', ENV=>${process.env.NODE_ENV}`
      )
    }

    return instance
  }

  async execute<T extends Record<string, unknown>>(
    query: string
  ): Promise<T[]> {
    await this.client.query(`SET search_path TO '${this.workspaceId}';`)
    const results = await this.client.query<T & QueryResultRow>(query)
    return results.rows as T[]
  }

  async connect(): Promise<boolean> {
    return true
  }

  async disconnect(): Promise<void> {
    // Connection pooling is intentionally kept alive for reuse.
  }

  getConectionIdentifier(): string {
    return `PG-${this.workspaceId}-${this.credentials.host}`
  }
}
