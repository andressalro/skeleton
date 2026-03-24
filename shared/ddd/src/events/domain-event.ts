import { UniqueEntityId } from '../unique-entity-id';

export interface DomainEventAttributes {
  [key: string]: unknown;
}

export interface DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly aggregateId: UniqueEntityId;
  readonly eventName: string;
  readonly payload: DomainEventAttributes;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly aggregateId: UniqueEntityId;
  readonly payload: DomainEventAttributes;
  abstract readonly eventName: string;

  protected constructor(params: {
    aggregateId: UniqueEntityId;
    payload: DomainEventAttributes;
    eventId?: string;
    occurredOn?: Date;
  }) {
    this.aggregateId = params.aggregateId;
    this.payload = params.payload;
    this.occurredOn = params.occurredOn ?? new Date();
    this.eventId = params.eventId ?? new UniqueEntityId().value;
  }

  serialize() {
    return {
      aggregateId: this.aggregateId.value,
      name: this.eventName,
      eventId: this.eventId,
      occurredOn: this.occurredOn.toISOString(),
      payload: this.payload,
    };
  }
}
