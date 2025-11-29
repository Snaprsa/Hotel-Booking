import twilio from 'twilio'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null

export interface WhatsAppMessageData {
  bookingId: string
  guestName: string
  guestPhone: string
  propertyName: string
  checkIn: string
  checkOut: string
  nights: number
  totalPrice: number
  currency: string
  hostName: string
}

/**
 * Send WhatsApp booking confirmation
 */
export async function sendWhatsAppConfirmation(data: WhatsAppMessageData) {
  if (!twilioClient) {
    console.error('Twilio client not initialized. Check your environment variables.')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const message = formatConfirmationMessage(data)

    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${data.guestPhone}`,
    })

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error('Error sending WhatsApp confirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send WhatsApp cancellation notification
 */
export async function sendWhatsAppCancellation(
  data: WhatsAppMessageData & { refundAmount?: number }
) {
  if (!twilioClient) {
    console.error('Twilio client not initialized')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const message = formatCancellationMessage(data)

    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${data.guestPhone}`,
    })

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error('Error sending WhatsApp cancellation:', error)
    return { success: false, error }
  }
}

/**
 * Send WhatsApp check-in reminder
 */
export async function sendWhatsAppReminder(data: WhatsAppMessageData) {
  if (!twilioClient) {
    console.error('Twilio client not initialized')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const message = formatReminderMessage(data)

    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${data.guestPhone}`,
    })

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error('Error sending WhatsApp reminder:', error)
    return { success: false, error }
  }
}

/**
 * Send WhatsApp notification to host
 */
export async function sendWhatsAppHostNotification(
  data: WhatsAppMessageData & { hostPhone: string }
) {
  if (!twilioClient) {
    console.error('Twilio client not initialized')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const message = formatHostNotificationMessage(data)

    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${data.hostPhone}`,
    })

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error('Error sending WhatsApp host notification:', error)
    return { success: false, error }
  }
}

// ============================================
// MESSAGE FORMATTERS
// ============================================

function formatConfirmationMessage(data: WhatsAppMessageData): string {
  return `
🎉 *Booking Confirmed!*

Hi ${data.guestName},

Your booking has been confirmed!

📍 *${data.propertyName}*
📅 Check-in: ${new Date(data.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
📅 Check-out: ${new Date(data.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
🌙 Nights: ${data.nights}
💰 Total: ${data.currency} ${data.totalPrice.toFixed(2)}

📋 Booking ID: #${data.bookingId.slice(0, 8)}

Your host ${data.hostName} will contact you with check-in details.

We're excited to host you! 🏡
  `.trim()
}

function formatCancellationMessage(
  data: WhatsAppMessageData & { refundAmount?: number }
): string {
  let message = `
❌ *Booking Cancelled*

Hi ${data.guestName},

Your booking for *${data.propertyName}* has been cancelled.

📋 Booking ID: #${data.bookingId.slice(0, 8)}
📅 Original Check-in: ${new Date(data.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
  `.trim()

  if (data.refundAmount && data.refundAmount > 0) {
    message += `\n\n💵 *Refund Amount:* ${data.currency} ${data.refundAmount.toFixed(2)}\nYour refund will be processed within 5-10 business days.`
  } else {
    message += `\n\nNo refund is applicable based on our cancellation policy.`
  }

  return message
}

function formatReminderMessage(data: WhatsAppMessageData): string {
  return `
⏰ *Check-in Reminder*

Hi ${data.guestName},

Your check-in is *tomorrow*!

📍 *${data.propertyName}*
📅 Check-in: ${new Date(data.checkIn).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

📋 Booking ID: #${data.bookingId.slice(0, 8)}

*Before You Go:*
✅ Review check-in instructions
✅ Confirm arrival time with host
✅ Prepare your ID

Host: ${data.hostName}

Have a wonderful stay! 🌟
  `.trim()
}

function formatHostNotificationMessage(
  data: WhatsAppMessageData & { hostPhone: string }
): string {
  return `
💰 *New Booking Received!*

Hi ${data.hostName},

You have a new booking for *${data.propertyName}*!

👤 Guest: ${data.guestName}
📱 Phone: ${data.guestPhone}
📅 Check-in: ${new Date(data.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
📅 Check-out: ${new Date(data.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
🌙 Nights: ${data.nights}
💰 Total: ${data.currency} ${data.totalPrice.toFixed(2)}

📋 Booking ID: #${data.bookingId.slice(0, 8)}

The guest has been notified. 🎉
  `.trim()
}

/**
 * Send SMS notification (alternative to WhatsApp)
 */
export async function sendSMSNotification(
  to: string,
  message: string
) {
  if (!twilioClient) {
    console.error('Twilio client not initialized')
    return { success: false, error: 'SMS service not configured' }
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_FROM,
      to: to,
    })

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { success: false, error }
  }
}

export default twilioClient
