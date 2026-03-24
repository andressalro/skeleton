import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  it('should generate a valid UUID when no id is provided', () => {
    const id = new UniqueEntityId();
    expect(id.value).toBeDefined();
    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should accept a valid UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = new UniqueEntityId(uuid);
    expect(id.value).toBe(uuid);
  });

  it('should throw when given an invalid UUID', () => {
    expect(() => new UniqueEntityId('invalid-uuid')).toThrow('Invalid UUID');
  });

  it('should compare two ids correctly', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id1 = new UniqueEntityId(uuid);
    const id2 = new UniqueEntityId(uuid);
    const id3 = new UniqueEntityId();

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });

  it('toString should return the UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = new UniqueEntityId(uuid);
    expect(id.toString()).toBe(uuid);
  });
});
