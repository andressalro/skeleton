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

  it('should return false when comparing entities of different classes', () => {
    class OtherEntity extends Entity<TestEntityProps> {
      static create(props: TestEntityProps, id?: UniqueEntityId): OtherEntity {
        return new OtherEntity(props, id);
      }
    }
    const id = new UniqueEntityId();
    const entity1 = TestEntity.create({ name: 'a' }, id);
    const entity2 = OtherEntity.create({ name: 'a' }, id);
    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should serialize to primitives with id', () => {
    const entity = TestEntity.create({ name: 'Alice' });
    const primitives = entity.toPrimitives();
    expect(primitives).toEqual({
      id: entity.id.toString(),
      name: 'Alice',
    });
  });

  it('toString should return JSON representation', () => {
    const entity = TestEntity.create({ name: 'Alice' });
    const expected = JSON.stringify({ id: entity.id.toString(), name: 'Alice' });
    expect(entity.toString()).toBe(expected);
  });
});
