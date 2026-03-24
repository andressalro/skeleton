import { AggregateRoot } from './aggregate-root';
import { UniqueEntityId } from './unique-entity-id';
import { BaseDomainEvent } from './events/domain-event';

interface OrderProps {
  total: number;
}

class OrderCreatedEvent extends BaseDomainEvent {
  readonly eventName = 'OrderCreated';

  static fromAggregate(aggregate: Order): OrderCreatedEvent {
    return new OrderCreatedEvent({
      aggregateId: aggregate.id,
      payload: aggregate.toPrimitives(),
    });
  }
}

class Order extends AggregateRoot<OrderProps> {
  get total(): number {
    return this.props.total;
  }

  static create(props: OrderProps, id?: UniqueEntityId): Order {
    const order = new Order(props, id);
    order.recordEvent(OrderCreatedEvent.fromAggregate(order));
    return order;
  }
}

describe('AggregateRoot', () => {
  it('should record and pull domain events', () => {
    const order = Order.create({ total: 100 });
    const events = order.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('OrderCreated');
    expect(events[0].aggregateId.equals(order.id)).toBe(true);
  });

  it('should clear events after pull', () => {
    const order = Order.create({ total: 100 });
    expect(order.pullDomainEvents()).toHaveLength(1);
    expect(order.pullDomainEvents()).toHaveLength(0);
  });

  it('should return a copy of events on pull (safe from mutation)', () => {
    const order = Order.create({ total: 100 });
    const events = order.pullDomainEvents();
    expect(events).toHaveLength(1);
    // after pull, no more events
    expect(order.pullDomainEvents()).toHaveLength(0);
    // but the pulled array still has the event
    expect(events).toHaveLength(1);
  });

  it('should include payload with aggregate primitives', () => {
    const order = Order.create({ total: 250 });
    const events = order.pullDomainEvents();
    expect(events[0].payload).toEqual({
      id: order.id.toString(),
      total: 250,
    });
  });

  it('should inherit entity comparison by id', () => {
    const id = new UniqueEntityId();
    const order1 = Order.create({ total: 100 }, id);
    const order2 = Order.create({ total: 200 }, id);
    expect(order1.equals(order2)).toBe(true);
  });

  it('should serialize event correctly', () => {
    const order = Order.create({ total: 100 });
    const events = order.pullDomainEvents();
    const serialized = (events[0] as OrderCreatedEvent).serialize();

    expect(serialized.name).toBe('OrderCreated');
    expect(serialized.aggregateId).toBe(order.id.value);
    expect(serialized.payload).toBeDefined();
    expect(serialized.occurredOn).toBeDefined();
  });
});
