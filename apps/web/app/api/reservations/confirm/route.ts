import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BookingSchema } from '@/lib/validation';
import { toPropertyMidnightUTC, getDatesInRange, formatPropertyDate } from '@/lib/tz';
import { sendEmail, sendTelegram } from '@/lib/notify';
import { generateGuestEmail } from '@/emails/guestConfirmation.html';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = BookingSchema.parse(body);

    const start = toPropertyMidnightUTC(data.startDate);
    const end = toPropertyMidnightUTC(data.endDate);
    const nights = getDatesInRange(start, end);

    const bookingCode = `RP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const cancelToken = crypto.randomBytes(32).toString('hex');

    // TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atomic Inventory Check & Update
      // We attempt to increment reserved count for all required nights where capacity allows.
      // UpdateMany returns count of updated rows. If count < required nights, we failed.

      const updateResult = await tx.inventory.updateMany({
        where: {
          roomId: data.roomId,
          date: { in: nights },
        },
        data: {
          reserved: { increment: 1 }
        }
      });

      if (updateResult.count !== nights.length) {
        throw new Error('SOLD_OUT');
      }

      // Verify inventory is not oversold
      const inventoryCheck = await tx.inventory.findMany({
        where: {
          roomId: data.roomId,
          date: { in: nights }
        }
      });

      const oversold = inventoryCheck.some(inv => inv.reserved > inv.total);
      if (oversold) {
        throw new Error('SOLD_OUT');
      }

      // 2. Fetch Rate Plan details for price calc
      const ratePlan = await tx.ratePlan.findUniqueOrThrow({
        where: { id: data.ratePlanId }
      });

      // 3. Calculate Price
      const nightCount = nights.length;
      const baseTotal = ratePlan.baseMinor * nightCount;
      const taxAmount = Math.round(baseTotal * (ratePlan.taxPercent / 100));
      const totalMinor = baseTotal + taxAmount;

      // 4. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          code: bookingCode,
          roomId: data.roomId,
          ratePlanId: data.ratePlanId,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          checkIn: start,
          checkOut: end,
          totalMinor,
          cancelToken,
          cancelTokenExpiresAt: new Date(Date.now() + ratePlan.cancelWindowHours * 3600 * 1000),
          status: 'CONFIRMED',
          nights: {
            create: nights.map(date => ({
              roomId: data.roomId,
              date: date
            }))
          }
        },
        include: { room: true, ratePlan: true }
      });

      return reservation;
    });

    // NOTIFICATIONS (After commit)
    const icsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ics/${result.code}`;
    const datesStr = `${formatPropertyDate(start)} - ${formatPropertyDate(end)}`;

    // Guest Email
    if (result.guestEmail) {
      await sendEmail(
        result.guestEmail,
        `[Raha Plaza] Booking Confirmed - ${result.code}`,
        generateGuestEmail(result, icsUrl)
      );
    }

    // Owner Alerts
    await sendEmail(
      process.env.SMTP_FROM!,
      `New Booking: ${result.code}`,
      `<p>New reservation by ${result.guestName} for ${datesStr}. Room: ${result.room.name}.</p>`
    );

    await sendTelegram(
      `<b>New Booking ${result.code}</b>\nGuest: ${result.guestName}\nRoom: ${result.room.name}\nDates: ${datesStr}`
    );

    return NextResponse.json({ code: result.code });

  } catch (error: any) {
    if (error.message === 'SOLD_OUT') {
      return NextResponse.json({ error: 'Room no longer available for these dates.' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
