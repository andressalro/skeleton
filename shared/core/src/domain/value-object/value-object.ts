import { InferPrimitives, Primitive } from '../types/primitives'

export interface ValueObjectProps {
  [key: string]:
    | Primitive
    | ValueObject<ValueObjectProps>
    | Array<Primitive>
    | Array<ValueObject<ValueObjectProps>>
    | Record<string, unknown>
    | undefined
    | Buffer
    | Date
}

export abstract class ValueObject<T extends ValueObjectProps> {
  constructor(protected readonly props: Readonly<T>) {
    if (props === null || props === undefined) {
      throw new Error('Props cannot be null or undefined')
    }
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo == null) {
      return false
    }
    return this.toString() === vo.toString()
  }

  toPrimitives(): InferPrimitives<T> {
    const primitive: Record<string, unknown> = {}
    for (const key in this.props) {
      const value = this.props[key]

      if (Array.isArray(value)) {
        primitive[key] = value.map((item) =>
          item instanceof ValueObject ? item.toPrimitives() : item
        )
        continue
      }

      if (value instanceof ValueObject) {
        primitive[key] = value.toPrimitives()
        continue
      }

      if (value instanceof Date) {
        primitive[key] = value.toISOString()
        continue
      }
      if (value instanceof Buffer) {
        primitive[key] = '<Buffer>'
        continue
      }

      primitive[key] =
        value instanceof ValueObject ? value.toPrimitives() : value
    }
    return primitive as InferPrimitives<T> // TODO: fix this any cast
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives())
  }
}
