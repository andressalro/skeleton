import { v7 } from 'uuid'

export class UniqueEntityID {
  private readonly _value: string
  constructor(existingId?: string) {
    this._value = existingId ?? v7()
  }

  equals(id?: UniqueEntityID): boolean {
    if (!id) {
      return false
    }
    // Ensure both value and constructor (class) are the same
    return id.constructor === this.constructor && id.value === this._value
  }

  get value(): string {
    return this._value
  }

  toString(): string {
    return this._value
  }
}
