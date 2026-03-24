import { Entity } from './entity';
import { UniqueEntityId } from './unique-entity-id';
import { DomainEvent } from './events/domain-event';

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props: TProps, id?: UniqueEntityId) {
    super(props, id);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this._domainEvents.slice();
    this._domainEvents = [];
    return events;
  }

  protected recordEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
