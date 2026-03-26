import { v7 as uuidv7 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from './unique-entity-id'

describe('UniqueEntityID', () => {
  it('should generate a valid uuid v7 if no id is provided', () => {
    const id = new UniqueEntityID()
    expect(typeof id.value).toBe('string')
  })

  it('should use the provided id if given', () => {
    const customId = uuidv7()
    const id = new UniqueEntityID(customId)
    expect(id.value).toBe(customId)
  })

  it('should compare equality by value', () => {
    const customId = uuidv7()
    const id1 = new UniqueEntityID(customId)
    const id2 = new UniqueEntityID(customId)
    expect(id1.equals(id2)).toBe(true)
    const id3 = new UniqueEntityID()
    expect(id1.equals(id3)).toBe(false)
    expect(id1.equals()).toBe(false)
  })

  it('toString should return the id value', () => {
    const customId = uuidv7()
    const id = new UniqueEntityID(customId)
    expect(id.toString()).toBe(customId)
  })
})
