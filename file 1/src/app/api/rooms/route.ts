import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDateRangeAvailable } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const category = searchParams.get('category');

    // Build where clause
    const where: any = {
      available: true,
    };

    if (guests) {
      where.maxGuests = {
        gte: parseInt(guests),
      };
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    // Get all rooms matching criteria
    const rooms = await prisma.room.findMany({
      where,
      include: {
        bookings: {
          where: {
            status: {
              in: ['pending', 'confirmed'],
            },
          },
          select: {
            checkIn: true,
            checkOut: true,
            status: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Filter by date availability if dates provided
    let availableRooms = rooms;
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      availableRooms = rooms.filter((room) => {
        return isDateRangeAvailable(room.bookings, checkInDate, checkOutDate);
      });
    }

    // Calculate average rating for each room
    const roomsWithRatings = availableRooms.map((room) => {
      const avgRating =
        room.reviews.length > 0
          ? room.reviews.reduce((sum, review) => sum + review.rating, 0) / room.reviews.length
          : 0;

      return {
        ...room,
        averageRating: avgRating,
        reviewCount: room.reviews.length,
        bookings: undefined, // Don't send bookings to client
        reviews: undefined, // Don't send individual reviews
      };
    });

    return NextResponse.json(roomsWithRatings);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
