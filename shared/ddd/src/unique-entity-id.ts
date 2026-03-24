import { v7 as uuidv7 } from 'uuid';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ?? uuidv7();
  }

  get value(): string {
    return this._value;
  }

  equals(other?: UniqueEntityId): boolean {
    if (!other) return false;
    return this._value === other._value && this.constructor === other.constructor;
  }

  toString(): string {
    return this._value;
  }
}
