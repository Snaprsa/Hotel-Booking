import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPaymentIntent } from '@/lib/stripe'

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent for a booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        guest: true,
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if payment already exists
    if (booking.payment && booking.payment.status === 'SUCCEEDED') {
      return NextResponse.json(
        { error: 'This booking has already been paid' },
        { status: 400 }
      )
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent({
      amount: booking.totalPrice,
      currency: booking.currency,
      bookingId: booking.id,
      customerEmail: booking.guestEmail,
      customerName: booking.guestName,
    })

    if (!paymentIntent.success) {
      return NextResponse.json(
        { error: paymentIntent.error || 'Failed to create payment intent' },
        { status: 500 }
      )
    }

    // Create or update payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        currency: booking.currency,
        status: 'PENDING',
        stripePaymentId: paymentIntent.paymentIntentId,
        stripeClientSecret: paymentIntent.clientSecret,
      },
      update: {
        stripePaymentId: paymentIntent.paymentIntentId,
        stripeClientSecret: paymentIntent.clientSecret,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      payment,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
