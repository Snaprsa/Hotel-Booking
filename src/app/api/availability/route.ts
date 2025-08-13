import { NextResponse } from 'next/server';
import { availabilitySchema } from '@/lib/validation';
import { getAvailableRoomTypes } from '@/lib/availability';
import { calculatePrice } from '@/lib/pricing';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { checkIn, checkOut } = parsed.data;
  const roomTypes = await getAvailableRoomTypes(checkIn, checkOut);
  const result = roomTypes.map((rt: any) => ({
    id: rt.id,
    slug: rt.slug,
    titleEN: rt.titleEN,
    titleAR: rt.titleAR,
    availableUnits: rt.availableUnits,
    price: calculatePrice({ roomType: rt, checkIn, checkOut }).total,
  }));
  return NextResponse.json({ roomTypes: result });
}
