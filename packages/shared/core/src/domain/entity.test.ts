import { describe, expect, it } from 'vitest'
import { Entity, EntityProps } from './entity'
import { UniqueEntityID } from './value-object/unique-entity-id'
import { ValueObject } from './value-object/value-object'

// Concrete entity for testing
interface UserProps extends EntityProps {
  name: string
  age: number
  email?: Email
  tags?: string[]
}

class Email extends ValueObject<{ address: string }> {
  get address() {
    return this.props.address
  }
}

class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }
  get name() {
    return this.props.name
  }
  get age() {
    return this.props.age
  }
  get tags() {
    return this.props.tags
  }
}

describe('Entity', () => {
  it('should assign id and props', () => {
    const user = new UserEntity({ name: 'Alice', age: 30 })
    expect(user.name).toEqual('Alice')
    expect(user.age).toEqual(30)
    expect(user.id).toBeInstanceOf(UniqueEntityID)
  })

  it('should use provided id if given', () => {
    const id = new UniqueEntityID('custom-id')
    const user = new UserEntity({ name: 'Bob', age: 25 }, id)
    expect(user.id).toBe(id)
  })

  it('equals should compare by id', () => {
    const id = new UniqueEntityID('same-id')
    const user1 = new UserEntity({ name: 'A', age: 1 }, id)
    const user2 = new UserEntity({ name: 'B', age: 2 }, id)
    expect(user1.equals(user2)).toBe(true)
    expect(user1.equals()).toBe(false)
    expect(user1.equals(user1)).toBe(true)
    const user3 = new UserEntity({ name: 'C', age: 3 })
    expect(user1.equals(user3)).toBe(false)
    // Different class
    class OtherEntity extends Entity<UserProps> {
      constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id)
      }
    }

    const other = new OtherEntity({ name: 'A', age: 1 }, id)
    expect(user1.equals(other)).toBe(false)
  })

  it('should serialize to primitives', () => {
    const user = new UserEntity({
      name: 'Alice',
      age: 30,
      email: new Email({ address: 'alice@example.com' }),
      tags: ['admin', 'user'],
    })
    const expectedPrimitives = {
      id: user.id.toString(),
      name: 'Alice',
      age: 30,
      email: { address: 'alice@example.com' },
      tags: ['admin', 'user'],
    }
    expect(user.toPrimitives()).toEqual(expectedPrimitives)

    expect(user.toString()).toBe(JSON.stringify(expectedPrimitives))
  })
})
