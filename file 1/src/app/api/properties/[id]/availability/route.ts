import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST check availability for a property
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { checkIn, checkOut } = body;

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    if (checkInDate < new Date()) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        propertyId: params.id,
        status: 'confirmed',
        OR: [
          // New booking starts during existing booking
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } }
            ]
          },
          // New booking ends during existing booking
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } }
            ]
          },
          // New booking completely contains existing booking
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } }
            ]
          }
        ]
      }
    });

    const isAvailable = overlappingBookings.length === 0;

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable
        ? 'Property is available for the selected dates'
        : 'Property is not available for the selected dates',
      conflictingBookings: overlappingBookings.map(b => ({
        checkIn: b.checkIn,
        checkOut: b.checkOut
      }))
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
