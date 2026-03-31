import { Primitive, WithId } from './types/primitives'
import { UniqueEntityID } from './value-object/unique-entity-id'
import { ValueObject, ValueObjectProps } from './value-object/value-object'

export interface EntityProps {
  [key: string]:
    | ValueObject<ValueObjectProps>
    | Primitive
    | Array<Primitive>
    | Array<Record<string, unknown>>
    | Array<ValueObject<ValueObjectProps>>
    | Entity<EntityProps>
    | Array<Entity<EntityProps>>
    | undefined
}

export abstract class Entity<T extends EntityProps> {
  readonly id: UniqueEntityID

  protected constructor(
    protected readonly props: T,
    id?: UniqueEntityID
  ) {
    this.id = id ?? new UniqueEntityID()
  }

  public equals(object?: Entity<T>): boolean {
    if (!object) {
      return false
    }

    if (this === object) {
      return true
    }

    if (this.constructor !== object.constructor) {
      return false
    }

    return this.id.equals(object.id)
  }

  // protected hasChanges(updatedProps: Readonly<T>): boolean {
  //   return JSON.stringify(updatedProps) !== JSON.stringify(this.props)
  // }

  // protected replaceProps(newProps: Readonly<T>): void {
  //   // ;(this as { props: T }).props = newProps
  // }

  toPrimitives(): WithId<T> {
    const primitive: Record<string, unknown> = {}
    for (const key in this.props) {
      const value = this.props[key]

      if (Array.isArray(value)) {
        primitive[key] = value.map((item) =>
          item instanceof ValueObject ? item.toPrimitives() : item
        )
        continue
      }

      if (value instanceof Entity) {
        primitive[key] = value.toPrimitives()
        continue
      }

      if (value instanceof ValueObject) {
        primitive[key] = value.toPrimitives()
        continue
      }

      if (value instanceof Buffer) {
        primitive[key] = '<Buffer>'
        continue
      }

      primitive[key] = value
    }
    return {
      id: this.id.toString(),
      ...primitive
    } as WithId<T> // TODO: fix this any cast
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives())
  }
}
