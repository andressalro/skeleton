import type { DomainEvent } from './domain-event'

export interface EventPublisher {
  publish(events: DomainEvent[]): Promise<void>
}
