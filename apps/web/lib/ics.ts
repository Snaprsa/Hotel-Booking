export function generateICS(
  summary: string,
  description: string,
  location: string,
  start: Date,
  end: Date
): string {
  const formatDate = (d: Date) => {
    // Simple UTC format for ICS: YYYYMMDDTHHMMSSZ
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const now = formatDate(new Date());
  const startStr = formatDate(start);
  const endStr = formatDate(end);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Raha Plaza//Booking//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startStr}
DTEND:${endStr}
DTSTAMP:${now}
UID:${now}-${Math.random().toString(36).substr(2)}@rahaplaza.com
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}
