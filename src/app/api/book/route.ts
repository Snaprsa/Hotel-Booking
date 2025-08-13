import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { ulid } from 'ulid';
import { calculatePrice } from '@/lib/pricing';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { roomTypeId, checkIn, checkOut, adults, children, customer, paymentMethod, promoCode } = parsed.data;
  const roomType = await prisma.roomType.findUnique({ where: { id: roomTypeId }, include: { pricingRules: true } });
  if (!roomType) return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
  const promo = promoCode ? await prisma.promoCode.findUnique({ where: { code: promoCode } }) : null;
  const customerRecord = await prisma.customer.upsert({
    where: { email: customer.email },
    update: { name: customer.name, phone: customer.phone },
    create: { name: customer.name, email: customer.email, phone: customer.phone },
  });
  const loyalty = customerRecord.loyaltyCount % 5 === 4;
  const price = calculatePrice({ roomType, checkIn, checkOut, promo: promo ? { mode: promo.mode, value: promo.value } : null, loyalty });
  const booking = await prisma.booking.create({
    data: {
      code: ulid().slice(-8),
      customerId: customerRecord.id,
      roomTypeId: roomType.id,
      checkIn,
      checkOut,
      adults,
      children,
      totalSar: Math.round(price.total),
      paymentMethod,
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      promoCodeId: promo?.id,
    },
  });
  return NextResponse.json({ booking });
}
