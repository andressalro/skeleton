import { ValueObject } from './value-object';

interface EmailProps {
  value: string;
}

class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return new Email({ value: email.toLowerCase() });
  }
}

describe('ValueObject', () => {
  it('should create a value object with frozen props', () => {
    const email = Email.create('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw if props is null or undefined', () => {
    expect(() => new (Email as any)(null)).toThrow('ValueObject props cannot be null or undefined');
    expect(() => new (Email as any)(undefined)).toThrow('ValueObject props cannot be null or undefined');
  });

  it('should compare two value objects with same props as equal', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');
    expect(email1.equals(email2)).toBe(true);
  });

  it('should compare two value objects with different props as not equal', () => {
    const email1 = Email.create('a@example.com');
    const email2 = Email.create('b@example.com');
    expect(email1.equals(email2)).toBe(false);
  });

  it('should return false when comparing with undefined', () => {
    const email = Email.create('test@example.com');
    expect(email.equals(undefined)).toBe(false);
  });

  it('should have immutable props', () => {
    const email = Email.create('test@example.com');
    expect(() => {
      (email as any).props.value = 'hacked@evil.com';
    }).toThrow();
  });

  it('should serialize to primitives', () => {
    const email = Email.create('test@example.com');
    expect(email.toPrimitives()).toEqual({ value: 'test@example.com' });
  });

  it('toString should return JSON string of primitives', () => {
    const email = Email.create('test@example.com');
    expect(email.toString()).toBe('{"value":"test@example.com"}');
  });
});
