import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookEvent = constructWebhookEvent(body, signature)

    if (!webhookEvent.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = webhookEvent.event!

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        const bookingId = paymentIntent.metadata.bookingId

        // Update payment status
        await prisma.payment.updateMany({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            status: 'SUCCEEDED',
            paidAt: new Date(),
            paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
          },
        })

        // Update booking status to CONFIRMED
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' },
        })

        console.log(`Payment succeeded for booking ${bookingId}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any

        // Update payment status
        await prisma.payment.updateMany({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            status: 'FAILED',
          },
        })

        console.log(`Payment failed for payment intent ${paymentIntent.id}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any

        // Update payment status to refunded
        await prisma.payment.updateMany({
          where: {
            stripePaymentId: charge.payment_intent,
          },
          data: {
            status: charge.refunded ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
          },
        })

        console.log(`Refund processed for charge ${charge.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
