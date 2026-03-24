import { BaseDomainEvent } from './domain-event';
import { UniqueEntityId } from '../unique-entity-id';

class TestEvent extends BaseDomainEvent {
  readonly eventName = 'TestEvent';

  constructor(aggregateId: UniqueEntityId) {
    super(aggregateId);
  }
}

describe('DomainEvent', () => {
  it('should create an event with aggregate id and occurred date', () => {
    const aggregateId = new UniqueEntityId();
    const event = new TestEvent(aggregateId);

    expect(event.aggregateId.equals(aggregateId)).toBe(true);
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.eventName).toBe('TestEvent');
    expect(event.eventId).toBeDefined();
  });

  it('should accept a custom event id', () => {
    const aggregateId = new UniqueEntityId();
    const customEventId = new UniqueEntityId().value;
    const event = new (class extends BaseDomainEvent {
      readonly eventName = 'Custom';
      constructor() {
        super(aggregateId, customEventId);
      }
    })();

    expect(event.eventId).toBe(customEventId);
  });
});
