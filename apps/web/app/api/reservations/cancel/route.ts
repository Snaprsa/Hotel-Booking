import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CancelSchema } from '@/lib/validation';
import { sendEmail, sendTelegram } from '@/lib/notify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = CancelSchema.parse(body);

    const reservation = await prisma.reservation.findUnique({
      where: { cancelToken: token },
      include: { nights: true, room: true }
    });

    if (!reservation || reservation.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Invalid booking' }, { status: 400 });
    }

    // Transaction: Release inventory, update status
    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservation.id },
        data: { status: 'CANCELLED', cancelToken: null }
      });

      // Decrement reserved count
      await tx.inventory.updateMany({
        where: {
          roomId: reservation.roomId,
          date: { in: reservation.nights.map(n => n.date) }
        },
        data: {
          reserved: { decrement: 1 }
        }
      });
    });

    // Notify
    await sendTelegram(`<b>Booking Cancelled ${reservation.code}</b>\nGuest: ${reservation.guestName}`);
    if (reservation.guestEmail) {
      await sendEmail(reservation.guestEmail, `Booking Cancelled - ${reservation.code}`, '<p>Your booking has been cancelled.</p>');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
  }
}
