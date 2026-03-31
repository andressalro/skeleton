import { describe, expect, it } from 'vitest'
import { ValueObject } from './value-object'

class Street extends ValueObject<{ name: string; number: number }> {
  constructor(props: { name: string; number: number }) {
    super(props)
  }
}

type AddressProps = { street: Street; city: string; anyStringArray?: string[] }

class Address extends ValueObject<AddressProps> {
  constructor(props: AddressProps) {
    super(props)
  }
}

describe('ValueObject', () => {
  it('should assign and expose props', () => {
    const address = new Address({
      street: new Street({ name: 'Main', number: 123 }),
      city: 'NY'
    })
    expect(address.toPrimitives()).toEqual({
      street: { name: 'Main', number: 123 },
      city: 'NY'
    })
  })

  it('should throw if props is null or undefined', () => {
    // @ts-expect-error should throw on undefined
    expect(() => new Address(undefined)).toThrow(Error)
    // @ts-expect-error should throw on null
    expect(() => new Address(null)).toThrow(Error)
  })

  it('should compare equality ', () => {
    const a1 = new Address({
      street: new Street({ name: 'Main', number: 123 }),
      city: 'NY'
    })
    const a2 = new Address({
      street: new Street({ name: 'Main', number: 123 }),
      city: 'NY'
    })
    const a3 = new Address({
      street: new Street({ name: 'Other', number: 456 }),
      city: 'LA'
    })
    expect(a1.equals(a2)).toBe(true)
    expect(a1.equals(a3)).toBe(false)
    expect(a1.equals()).toBe(false)
  })

  it('should serialize to primitives', () => {
    const address = new Address({
      street: new Street({ name: 'Main', number: 123 }),
      city: 'NY',
      anyStringArray: ['one', 'two']
    })
    expect(address.toPrimitives()).toEqual({
      street: { name: 'Main', number: 123 },
      city: 'NY',
      anyStringArray: ['one', 'two']
    })
  })

  it('toString should return JSON string of props', () => {
    const address = new Address({
      street: new Street({ name: 'Main', number: 123 }),
      city: 'NY'
    })
    expect(address.toString()).toBe(
      '{"street":{"name":"Main","number":123},"city":"NY"}'
    )
  })
})
