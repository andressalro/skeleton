import { Entity, EntityProps } from './entity'
import { DomainEvent } from './events/domain-event'
import { UniqueEntityID } from './value-object/unique-entity-id'

export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {
  private domainEvents: DomainEvent[] = []

  protected constructor(props: T, id?: UniqueEntityID) {
    super(props, id)
  }

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents.slice()
    this.domainEvents = []
    return domainEvents
  }

  protected recordEvent(event: DomainEvent): void {
    this.domainEvents.push(event)
  }
}
