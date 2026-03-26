import { UniqueEntityID } from '../value-object/unique-entity-id'
export interface DomainEventAttributes {
  [key: string]: unknown
}

export abstract class DomainEvent {
  abstract readonly eventName: string
  readonly aggregateId: UniqueEntityID
  readonly eventId: UniqueEntityID
  readonly occurredAt: number
  readonly payload: DomainEventAttributes

  protected constructor(params: {
    aggregateId: UniqueEntityID
    payload: DomainEventAttributes
    occurredAt?: number
    eventId?: UniqueEntityID
  }) {
    const { aggregateId, payload, eventId, occurredAt } = params
    this.aggregateId = aggregateId
    this.eventId = eventId ?? new UniqueEntityID()
    this.occurredAt = occurredAt ?? Date.now()
    this.payload = payload
  }

  serialize() {
    return {
      aggregateId: this.aggregateId.value,
      name: this.eventName,
      eventId: this.eventId.value,
      occurredAt: this.occurredAt,
      payload: this.payload,
    }
  }
}
