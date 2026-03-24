import { toISODate, addDays, diffInDays, isDateInRange, startOfDay, endOfDay } from './date-utils';

describe('date-utils', () => {
  describe('toISODate', () => {
    it('should format a date as YYYY-MM-DD', () => {
      const date = new Date('2025-06-15T10:30:00Z');
      expect(toISODate(date)).toBe('2025-06-15');
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      const date = new Date('2025-01-01');
      const result = addDays(date, 10);
      expect(toISODate(result)).toBe('2025-01-11');
    });

    it('should subtract days with negative number', () => {
      const date = new Date('2025-01-11');
      const result = addDays(date, -5);
      expect(toISODate(result)).toBe('2025-01-06');
    });

    it('should not mutate the original date', () => {
      const date = new Date('2025-01-01');
      addDays(date, 10);
      expect(toISODate(date)).toBe('2025-01-01');
    });
  });

  describe('diffInDays', () => {
    it('should return positive diff when to > from', () => {
      const from = new Date('2025-01-01');
      const to = new Date('2025-01-11');
      expect(diffInDays(from, to)).toBe(10);
    });

    it('should return negative diff when to < from', () => {
      const from = new Date('2025-01-11');
      const to = new Date('2025-01-01');
      expect(diffInDays(from, to)).toBe(-10);
    });

    it('should return 0 for same day', () => {
      const date = new Date('2025-06-15');
      expect(diffInDays(date, date)).toBe(0);
    });
  });

  describe('isDateInRange', () => {
    it('should return true when date is within range', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      const date = new Date('2025-06-15');
      expect(isDateInRange(date, start, end)).toBe(true);
    });

    it('should return true on boundaries', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      expect(isDateInRange(start, start, end)).toBe(true);
      expect(isDateInRange(end, start, end)).toBe(true);
    });

    it('should return false when outside range', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      const outside = new Date('2026-01-01');
      expect(isDateInRange(outside, start, end)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('should set time to 00:00:00.000', () => {
      const date = new Date('2025-06-15T15:30:45.123');
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should set time to 23:59:59.999', () => {
      const date = new Date('2025-06-15T08:00:00');
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });
});
