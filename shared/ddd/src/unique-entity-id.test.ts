import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  it('should generate a valid UUID v7 when no id is provided', () => {
    const id = new UniqueEntityId();
    expect(id.value).toBeDefined();
    expect(typeof id.value).toBe('string');
  });

  it('should accept a valid UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = new UniqueEntityId(uuid);
    expect(id.value).toBe(uuid);
  });

  it('should compare two ids correctly', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id1 = new UniqueEntityId(uuid);
    const id2 = new UniqueEntityId(uuid);
    const id3 = new UniqueEntityId();

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
    expect(id1.equals(undefined)).toBe(false);
  });

  it('toString should return the UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = new UniqueEntityId(uuid);
    expect(id.toString()).toBe(uuid);
  });
});
