import { describe, expect, it } from 'vitest'
import { DomainError } from './domain-error'

// Subclase concreta para pruebas
class TestDomainError extends DomainError {
  readonly name = 'TestDomainError'
}

describe('DomainError', () => {
  it('should assign the message and params', () => {
    const error = new TestDomainError('Error message', { foo: 123 })
    expect(error.message).toBe('Error message')
    expect(error.params).toEqual({ foo: 123 })
    expect(error.name).toBe('TestDomainError')
  })

  it('serialize should return the correct JSON and toString', () => {
    const error = new TestDomainError('Error', { bar: true })
    const json = error.serialize()

    const expectedJson = {
      type: 'DOMAIN_ERROR',
      name: 'TestDomainError',
      message: 'Error',
      params: { bar: true },
    }
    expect(json).toEqual(expectedJson)
    expect(error.toString()).toBe(JSON.stringify(expectedJson))
  })
})
