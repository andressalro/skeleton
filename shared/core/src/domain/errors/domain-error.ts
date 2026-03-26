export abstract class DomainError extends Error {
  public abstract readonly name: string // each subclass must define its own name
  constructor(
    readonly message: string,
    readonly params?: Record<string, string | number | boolean>
  ) {
    super(message)
  }

  serialize() {
    return {
      type: 'DOMAIN_ERROR',
      name: this.name,
      message: this.message,
      params: this.params,
    }
  }

  toString() {
    return JSON.stringify(this.serialize())
  }
}
