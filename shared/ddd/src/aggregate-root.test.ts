import { AggregateRoot } from './aggregate-root';
import { UniqueEntityId } from './unique-entity-id';
import { BaseDomainEvent } from './events/domain-event';

interface OrderProps {
  total: number;
}

class OrderCreatedEvent extends BaseDomainEvent {
  readonly eventName = 'OrderCreated';
  constructor(aggregateId: UniqueEntityId) {
    super(aggregateId);
  }
}

class Order extends AggregateRoot<OrderProps> {
  get total(): number {
    return this.props.total;
  }

  static create(props: OrderProps, id?: UniqueEntityId): Order {
    const order = new Order(props, id);
    order.addDomainEvent(new OrderCreatedEvent(order.id));
    return order;
  }
}

describe('AggregateRoot', () => {
  it('should collect domain events', () => {
    const order = Order.create({ total: 100 });
    expect(order.domainEvents).toHaveLength(1);
    expect(order.domainEvents[0].eventName).toBe('OrderCreated');
  });

  it('should clear domain events', () => {
    const order = Order.create({ total: 100 });
    expect(order.domainEvents).toHaveLength(1);

    order.clearEvents();
    expect(order.domainEvents).toHaveLength(0);
  });

  it('should return a copy of domain events (immutable)', () => {
    const order = Order.create({ total: 100 });
    const events = order.domainEvents;
    expect(events).toHaveLength(1);

    order.clearEvents();
    // The previously retrieved array should still have 1 event
    expect(events).toHaveLength(1);
    expect(order.domainEvents).toHaveLength(0);
  });

  it('should inherit entity comparison by id', () => {
    const id = new UniqueEntityId();
    const order1 = Order.create({ total: 100 }, id);
    const order2 = Order.create({ total: 200 }, id);
    expect(order1.equals(order2)).toBe(true);
  });
});
