import { UniqueEntityId } from '../unique-entity-id';

export interface DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly aggregateId: UniqueEntityId;
  readonly eventName: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly aggregateId: UniqueEntityId;
  abstract readonly eventName: string;

  constructor(aggregateId: UniqueEntityId, eventId?: string) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.eventId = eventId ?? new UniqueEntityId().value;
  }
}
