import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { startOfDay, addDays } from 'date-fns';

const PROPERTY_TZ = process.env.PROPERTY_TZ || 'Asia/Riyadh';

// Convert any date input to the property's midnight in UTC
export function toPropertyMidnightUTC(date: Date | string): Date {
  const zoned = toZonedTime(date, PROPERTY_TZ);
  const midnight = startOfDay(zoned);
  return fromZonedTime(midnight, PROPERTY_TZ);
}

export function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let current = new Date(start);
  while (current < end) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  return dates;
}

export function formatPropertyDate(date: Date): string {
  return toZonedTime(date, PROPERTY_TZ).toLocaleDateString('en-GB', {
    timeZone: PROPERTY_TZ,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
