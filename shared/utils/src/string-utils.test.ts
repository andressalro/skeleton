import { capitalize, toCamelCase, toSnakeCase, toKebabCase, truncate, slugify } from './string-utils';

describe('string-utils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should convert kebab-case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert spaces', () => {
      expect(toCamelCase('hello world test')).toBe('helloWorldTest');
    });

    it('should handle PascalCase input', () => {
      expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert spaces', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('hi', 10)).toBe('hi');
    });

    it('should truncate and add ellipsis', () => {
      expect(truncate('Hello World, this is long', 10)).toBe('Hello W...');
    });

    it('should return the full string at exact length', () => {
      expect(truncate('12345', 5)).toBe('12345');
    });
  });

  describe('slugify', () => {
    it('should create a URL-safe slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should handle accented characters', () => {
      expect(slugify('Café résumé')).toBe('cafe-resume');
    });

    it('should handle multiple special characters', () => {
      expect(slugify('--Hello   World!!--')).toBe('hello-world');
    });
  });
});
