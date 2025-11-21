import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SearchSchema } from '@/lib/validation';
import { toPropertyMidnightUTC, getDatesInRange } from '@/lib/tz';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate, adults } = SearchSchema.parse(body);

    const start = toPropertyMidnightUTC(startDate);
    const end = toPropertyMidnightUTC(endDate);

    if (start >= end) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    const nights = getDatesInRange(start, end);

    // Find rooms where for EVERY requested night, (total - reserved) > 0
    const rooms = await prisma.room.findMany({
      where: {
        active: true,
        capacity: { gte: adults },
      },
      include: {
        ratePlans: true,
        inventory: {
          where: {
            date: { in: nights }
          }
        }
      }
    });

    const availableRooms = rooms.filter(room => {
      // Must have inventory record for every night AND have availability
      const availableNights = room.inventory.filter(inv =>
        nights.some(n => n.getTime() === inv.date.getTime()) &&
        (inv.total - inv.reserved) > 0
      );
      return availableNights.length === nights.length;
    });

    return NextResponse.json({ rooms: availableRooms });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
