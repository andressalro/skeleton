import { describe, it, expect } from 'vitest'
import { AggregateRoot } from './aggregate-root'
import { DomainEvent } from './events/domain-event'
import { UniqueEntityID } from './value-object/unique-entity-id'
class TestAggregate extends AggregateRoot<{ foo: string }> {
  static create(props: { foo: string }, id?: UniqueEntityID): TestAggregate {
    const aggregate = new TestAggregate(props, id)
    aggregate.recordEvent(TestEventCreated.fromAggregate(aggregate))
    return aggregate
  }
}
class TestEventCreated extends DomainEvent {
  public readonly eventName = 'TestEvent.Created'
  static fromAggregate(aggregate: TestAggregate): DomainEvent {
    return new TestEventCreated({
      aggregateId: aggregate.id,
      payload: aggregate.toPrimitives(),
    })
  }
}

describe('AggregateRoot', () => {
  it('should record and pull domain events', () => {
    const aggregate = TestAggregate.create({ foo: 'bar' })
    const event1 = TestEventCreated.fromAggregate(aggregate)

    const events = aggregate.pullDomainEvents()
    expect(events).toHaveLength(1)
    expect(events[0].aggregateId).toEqual(aggregate.id)
    expect(events[0].eventName).toEqual(event1.eventName)
    expect(events[0].payload).toEqual(aggregate.toPrimitives())
    expect(events[0]).toBeInstanceOf(TestEventCreated)

    // After pulling, the list should be empty
    expect(aggregate.pullDomainEvents()).toHaveLength(0)
  })
})
