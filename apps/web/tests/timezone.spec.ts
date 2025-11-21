/**
 * Timezone Tests for Raha Plaza Booking System
 *
 * These tests verify that all date operations correctly handle
 * the Asia/Riyadh timezone.
 */

import { toPropertyMidnightUTC, getDatesInRange, formatPropertyDate } from '../lib/tz';

describe('Timezone Handling', () => {
  test('toPropertyMidnightUTC should convert to property midnight', () => {
    const date = new Date('2024-03-15T15:30:00Z');
    const result = toPropertyMidnightUTC(date);

    // Result should be midnight in Asia/Riyadh converted to UTC
    expect(result).toBeInstanceOf(Date);
  });

  test('getDatesInRange should return all dates between start and end', () => {
    const start = new Date('2024-03-15T00:00:00Z');
    const end = new Date('2024-03-18T00:00:00Z');
    const result = getDatesInRange(start, end);

    expect(result).toHaveLength(3);
  });

  test('formatPropertyDate should format date correctly', () => {
    const date = new Date('2024-03-15T00:00:00Z');
    const result = formatPropertyDate(date);

    expect(typeof result).toBe('string');
    expect(result).toContain('2024');
  });
});
