import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAvailability, calculateBookingPrice, validateBookingInput } from '@/lib/booking-utils'
import { sendBookingNotifications } from '@/lib/notifications'
import { differenceInDays } from 'date-fns'

/**
 * GET /api/bookings - Get all bookings for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        guestId: userId,
        ...(status && { status: status as any }),
      },
      include: {
        property: {
          include: {
            images: {
              where: { isCover: true },
              take: 1,
            },
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings - Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      propertyId,
      guestId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults,
      children = 0,
      infants = 0,
      specialRequests,
    } = body

    // Validate required fields
    if (!propertyId || !guestId || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Validate booking input
    const validation = validateBookingInput({
      checkIn,
      checkOut,
      adults,
      children,
      infants,
      maxGuests: property.maxGuests,
    })

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Check availability
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    const availability = await checkAvailability(propertyId, checkInDate, checkOutDate)

    if (!availability.available) {
      return NextResponse.json(
        { error: availability.reason || 'Property not available' },
        { status: 400 }
      )
    }

    // Calculate pricing
    const nights = differenceInDays(checkOutDate, checkInDate)
    const pricing = calculateBookingPrice(
      property.pricePerNight,
      nights,
      property.cleaningFee,
      property.serviceFee
    )

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        guestName,
        guestEmail,
        guestPhone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        adults,
        children,
        infants,
        totalGuests: adults + children + infants,
        pricePerNight: property.pricePerNight,
        totalNights: pricing.totalNights,
        cleaningFee: pricing.cleaningFee,
        serviceFee: pricing.serviceFee,
        totalPrice: pricing.totalPrice,
        currency: property.currency,
        specialRequests,
        status: 'PENDING',
      },
      include: {
        property: {
          include: {
            images: true,
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    // Send Email and WhatsApp notifications asynchronously
    // Don't wait for notifications to complete - send them in background
    sendBookingNotifications(booking as any).catch(error => {
      console.error('Error sending booking notifications:', error)
    })

    return NextResponse.json(
      { booking, message: 'Booking created successfully. Confirmation sent to your email and WhatsApp!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
