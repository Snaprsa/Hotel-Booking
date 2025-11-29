import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCancellationNotifications } from '@/lib/notifications'

/**
 * GET /api/bookings/[id] - Get a specific booking by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        property: {
          include: {
            images: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
              },
            },
          },
        },
        payment: true,
        notifications: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/bookings/[id] - Update booking status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'CANCELLED' && {
          cancelledAt: new Date(),
        }),
      },
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      booking,
      message: `Booking ${status.toLowerCase()} successfully`,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bookings/[id] - Cancel a booking
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get('reason')

    // Check if booking exists and can be cancelled
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        payment: true,
      },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (existingBooking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (existingBooking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed booking' },
        { status: 400 }
      )
    }

    // Calculate refund amount based on cancellation policy
    // For now, using a simple policy: full refund if cancelled 24h before check-in
    const now = new Date()
    const checkIn = new Date(existingBooking.checkIn)
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60)

    let refundAmount = 0
    if (hoursUntilCheckIn > 24) {
      refundAmount = existingBooking.totalPrice // Full refund
    } else if (hoursUntilCheckIn > 0) {
      refundAmount = existingBooking.totalPrice * 0.5 // 50% refund
    }
    // No refund if after check-in

    // Cancel the booking
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason || undefined,
        cancelledAt: new Date(),
        refundAmount,
      },
      include: {
        property: {
          include: {
            host: true,
          },
        },
        guest: true,
      },
    })

    // Update payment status if exists
    if (existingBooking.payment) {
      await prisma.payment.update({
        where: { id: existingBooking.payment.id },
        data: {
          status: refundAmount > 0 ? 'REFUNDED' : 'SUCCEEDED',
        },
      })
    }

    // Send cancellation notifications (Email + WhatsApp)
    sendCancellationNotifications(booking as any, refundAmount).catch(error => {
      console.error('Error sending cancellation notifications:', error)
    })

    return NextResponse.json({
      booking,
      refundAmount,
      message: 'Booking cancelled successfully. Cancellation confirmation sent to your email and WhatsApp.',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
