import { Entity } from './entity';
import { UniqueEntityId } from './unique-entity-id';

interface TestEntityProps {
  name: string;
}

class TestEntity extends Entity<TestEntityProps> {
  get name(): string {
    return this.props.name;
  }

  static create(props: TestEntityProps, id?: UniqueEntityId): TestEntity {
    return new TestEntity(props, id);
  }
}

describe('Entity', () => {
  it('should create an entity with auto-generated id', () => {
    const entity = TestEntity.create({ name: 'test' });
    expect(entity.id).toBeDefined();
    expect(entity.name).toBe('test');
  });

  it('should create an entity with a given id', () => {
    const id = new UniqueEntityId();
    const entity = TestEntity.create({ name: 'test' }, id);
    expect(entity.id.equals(id)).toBe(true);
  });

  it('should compare entities by id', () => {
    const id = new UniqueEntityId();
    const entity1 = TestEntity.create({ name: 'a' }, id);
    const entity2 = TestEntity.create({ name: 'b' }, id);
    const entity3 = TestEntity.create({ name: 'a' });

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });

  it('should return false when comparing with undefined', () => {
    const entity = TestEntity.create({ name: 'test' });
    expect(entity.equals(undefined)).toBe(false);
  });

  it('should return true when comparing with itself', () => {
    const entity = TestEntity.create({ name: 'test' });
    expect(entity.equals(entity)).toBe(true);
  });
});
