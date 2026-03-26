import { describe, it, expect } from 'vitest'
import { DomainEvent } from './domain-event'
import { UniqueEntityID } from '../value-object/unique-entity-id'
import { AggregateRoot } from '../..'

class TestAggregateCreated extends DomainEvent {
  readonly eventName = 'TestAggregate.Created'

  static fromAggregate(aggregate: TestAggregate): DomainEvent {
    const event = new this({
      aggregateId: aggregate.id,
      payload: aggregate.toPrimitives(),
    })
    return event
  }
}

class TestAggregate extends AggregateRoot<{
  foo: string
  bar: number
}> {
  static create(
    props: { foo: string; bar: number },
    id?: UniqueEntityID
  ): TestAggregate {
    const aggregate = new TestAggregate(props, id)
    aggregate.recordEvent(TestAggregateCreated.fromAggregate(aggregate))
    return aggregate
  }
}

describe('DomainEvent', () => {
  it('should assign all properties and generate eventId if not provided', () => {
    const payload = { foo: 'bar', bar: 42 }
    const aggregateId = new UniqueEntityID('agg-1')
    const aggregate = TestAggregate.create(payload, aggregateId)

    const event = TestAggregateCreated.fromAggregate(aggregate)
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toEqual({ ...payload, id: aggregate.id.toString() })
    expect(event.eventId).toBeInstanceOf(UniqueEntityID)
    expect(event.occurredAt).toBeTypeOf('number')
    expect(event.eventName).toBe('TestAggregate.Created')
  })

  it('should return snapshot ', () => {
    const payload = { foo: 'bar', bar: 42 }
    const aggregateId = new UniqueEntityID('agg-1')
    const aggregate = TestAggregate.create(payload, aggregateId)
    const event = TestAggregateCreated.fromAggregate(aggregate)

    expect(event.serialize()).toEqual({
      payload: { ...payload, id: aggregate.id.toString() },
      name: event.eventName,
      aggregateId: event.aggregateId.value,
      eventId: event.eventId.value,
      occurredAt: event.occurredAt,
    })
  })

  it('should create event from aggregate using factory', () => {
    const aggregate = TestAggregate.create(
      { foo: 'agg', bar: 1 },
      new UniqueEntityID('agg-4')
    )
    const event = TestAggregateCreated.fromAggregate(aggregate)
    expect(event.aggregateId).toEqual(aggregate.id)
    expect(event.payload).toEqual({
      foo: 'agg',
      bar: 1,
      id: aggregate.id.toString(),
    })
    expect(event).toBeInstanceOf(TestAggregateCreated)
  })
})
