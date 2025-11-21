import { prisma } from '@/lib/db';
import { generateICS } from '@/lib/ics';

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const reservation = await prisma.reservation.findUnique({
    where: { code: params.code },
    include: { room: true }
  });

  if (!reservation) return new Response('Not found', { status: 404 });

  const fileContent = generateICS(
    `Stay at ${reservation.room.name}`,
    `Reservation Code: ${reservation.code}`,
    'Raha Plaza, Al Khobar',
    reservation.checkIn,
    reservation.checkOut
  );

  return new Response(fileContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="booking-${reservation.code}.ics"`
    }
  });
}
