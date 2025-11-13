import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateConfirmationCode, calculateNights, isDateRangeAvailable } from '@/lib/utils';
import { sendAllNotifications } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      roomId,
      userId,
      checkIn,
      checkOut,
      guestAdults,
      guestChildren = 0,
      guestInfants = 0,
      guestName,
      guestEmail,
      guestPhone,
      guestWhatsapp,
      specialRequests,
    } = body;

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Get room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        bookings: {
          where: {
            status: {
              in: ['pending', 'confirmed'],
            },
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.available) {
      return NextResponse.json({ error: 'Room not available' }, { status: 400 });
    }

    // Check if room is available for these dates
    if (!isDateRangeAvailable(room.bookings, checkInDate, checkOutDate)) {
      return NextResponse.json(
        { error: 'Room not available for selected dates' },
        { status: 400 }
      );
    }

    const guests = guestAdults + guestChildren;
    if (guests > room.maxGuests) {
      return NextResponse.json(
        { error: `Room can accommodate maximum ${room.maxGuests} guests` },
        { status: 400 }
      );
    }

    // Calculate total price
    const nights = calculateNights(checkInDate, checkOutDate);
    const totalPrice = room.price * nights;

    // Generate confirmation code
    let confirmationCode = generateConfirmationCode();

    // Ensure confirmation code is unique
    let existingBooking = await prisma.booking.findUnique({
      where: { confirmationCode },
    });

    while (existingBooking) {
      confirmationCode = generateConfirmationCode();
      existingBooking = await prisma.booking.findUnique({
        where: { confirmationCode },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId || 'guest',
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        guestAdults,
        guestChildren,
        guestInfants,
        totalPrice,
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        guestWhatsapp,
        specialRequests,
        confirmationCode,
        status: 'confirmed',
      },
      include: {
        room: true,
      },
    });

    // Send notifications
    const notificationResults = await sendAllNotifications({
      email: guestEmail,
      phone: guestPhone,
      whatsapp: guestWhatsapp,
      guestName,
      confirmationCode,
      roomTitle: room.title,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
    });

    console.log('Notification results:', notificationResults);

    return NextResponse.json({
      success: true,
      booking,
      notifications: notificationResults,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET - Get bookings for a user or by confirmation code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const confirmationCode = searchParams.get('confirmationCode');
    const email = searchParams.get('email');

    if (!userId && !confirmationCode && !email) {
      return NextResponse.json(
        { error: 'userId, confirmationCode, or email required' },
        { status: 400 }
      );
    }

    const where: any = {};

    if (confirmationCode) {
      where.confirmationCode = confirmationCode;
    } else if (userId) {
      where.userId = userId;
    } else if (email) {
      where.guestEmail = email;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
