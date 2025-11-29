import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  bookingId: string
  customerEmail: string
  customerName: string
}

/**
 * Create a Stripe Payment Intent
 */
export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Stripe uses cents
      currency: params.currency.toLowerCase(),
      metadata: {
        bookingId: params.bookingId,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    }
  }
}

/**
 * Retrieve a payment intent
 */
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      paymentIntent,
    }
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
    }
  }
}

/**
 * Create a refund
 */
export async function createRefund(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
    })

    return {
      success: true,
      refund,
    }
  } catch (error) {
    console.error('Error creating refund:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create refund',
    }
  }
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    return { success: true, event }
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify webhook',
    }
  }
}

export default stripe
