import { BaseDomainEvent } from './domain-event';
import { UniqueEntityId } from '../unique-entity-id';

class TestEvent extends BaseDomainEvent {
  readonly eventName = 'TestEvent';

  static fromAggregate(aggregateId: UniqueEntityId, payload: Record<string, unknown>): TestEvent {
    return new TestEvent({ aggregateId, payload });
  }
}

describe('DomainEvent', () => {
  it('should create an event with aggregate id, payload, and occurred date', () => {
    const aggregateId = new UniqueEntityId();
    const payload = { foo: 'bar' };
    const event = TestEvent.fromAggregate(aggregateId, payload);

    expect(event.aggregateId.equals(aggregateId)).toBe(true);
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.eventName).toBe('TestEvent');
    expect(event.eventId).toBeDefined();
    expect(event.payload).toEqual(payload);
  });

  it('should serialize the event to a plain object', () => {
    const aggregateId = new UniqueEntityId();
    const payload = { orderId: '123', total: 100 };
    const event = TestEvent.fromAggregate(aggregateId, payload);

    const serialized = event.serialize();
    expect(serialized).toEqual({
      aggregateId: aggregateId.value,
      name: 'TestEvent',
      eventId: event.eventId,
      occurredOn: event.occurredOn.toISOString(),
      payload,
    });
  });

  it('should accept a custom event id', () => {
    const aggregateId = new UniqueEntityId();
    const customEventId = new UniqueEntityId().value;
    const event = new (class extends BaseDomainEvent {
      readonly eventName = 'Custom';
      constructor() {
        super({ aggregateId, payload: {}, eventId: customEventId });
      }
    })();

    expect(event.eventId).toBe(customEventId);
  });
});
