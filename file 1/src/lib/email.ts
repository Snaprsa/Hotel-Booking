import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export interface BookingEmailData {
  bookingId: string
  guestName: string
  guestEmail: string
  propertyName: string
  checkIn: string
  checkOut: string
  nights: number
  totalGuests: number
  totalPrice: number
  currency: string
  propertyAddress: string
  hostName: string
  hostEmail: string
  confirmationCode?: string
}

/**
 * Send booking confirmation email to guest
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Hotel Booking <noreply@yourdomain.com>',
      to: [data.guestEmail],
      subject: `Booking Confirmed - ${data.propertyName}`,
      html: bookingConfirmationTemplate(data),
    })

    if (error) {
      console.error('Error sending confirmation email:', error)
      throw error
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send booking notification to host
 */
export async function sendHostNotificationEmail(data: BookingEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Hotel Booking <noreply@yourdomain.com>',
      to: [data.hostEmail],
      subject: `New Booking Received - ${data.propertyName}`,
      html: hostNotificationTemplate(data),
    })

    if (error) {
      console.error('Error sending host notification:', error)
      throw error
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Failed to send host notification:', error)
    return { success: false, error }
  }
}

/**
 * Send booking cancellation email
 */
export async function sendCancellationEmail(data: BookingEmailData & { refundAmount?: number }) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Hotel Booking <noreply@yourdomain.com>',
      to: [data.guestEmail],
      subject: `Booking Cancelled - ${data.propertyName}`,
      html: cancellationTemplate(data),
    })

    if (error) {
      console.error('Error sending cancellation email:', error)
      throw error
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Failed to send cancellation email:', error)
    return { success: false, error }
  }
}

/**
 * Send reminder email 24 hours before check-in
 */
export async function sendCheckInReminderEmail(data: BookingEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Hotel Booking <noreply@yourdomain.com>',
      to: [data.guestEmail],
      subject: `Reminder: Check-in Tomorrow - ${data.propertyName}`,
      html: checkInReminderTemplate(data),
    })

    if (error) {
      console.error('Error sending reminder email:', error)
      throw error
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Failed to send reminder email:', error)
    return { success: false, error }
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function bookingConfirmationTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .booking-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #555;
    }
    .detail-value {
      color: #333;
    }
    .total {
      background: #667eea;
      color: white;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #888;
      font-size: 12px;
    }
    h1 { margin: 0; font-size: 28px; }
    h2 { color: #333; font-size: 22px; margin-top: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Booking Confirmed!</h1>
  </div>

  <div class="content">
    <h2>Hi ${data.guestName},</h2>
    <p>Great news! Your booking has been confirmed. We're excited to host you!</p>

    <div class="booking-details">
      <h3 style="margin-top: 0;">📍 ${data.propertyName}</h3>
      <p style="color: #666; margin: 5px 0;">${data.propertyAddress}</p>

      <div class="detail-row">
        <span class="detail-label">Booking ID:</span>
        <span class="detail-value">#${data.bookingId.slice(0, 8)}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Check-in:</span>
        <span class="detail-value">${new Date(data.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Check-out:</span>
        <span class="detail-value">${new Date(data.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Nights:</span>
        <span class="detail-value">${data.nights} night${data.nights > 1 ? 's' : ''}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Guests:</span>
        <span class="detail-value">${data.totalGuests} guest${data.totalGuests > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="total">
      Total: ${data.currency} ${data.totalPrice.toFixed(2)}
    </div>

    <h3>📞 Host Contact</h3>
    <p>
      <strong>Host:</strong> ${data.hostName}<br>
      <strong>Email:</strong> ${data.hostEmail}
    </p>

    <p style="margin-top: 30px;">
      You'll receive a reminder email 24 hours before your check-in date.
    </p>

    <center>
      <a href="${process.env.SITE_URL || 'http://localhost:3000'}/bookings/${data.bookingId}" class="button">
        View Booking Details
      </a>
    </center>
  </div>

  <div class="footer">
    <p>This is an automated email. Please do not reply.</p>
    <p>© ${new Date().getFullYear()} Hotel Booking. All rights reserved.</p>
  </div>
</body>
</html>
  `
}

function hostNotificationTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #28a745;
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .booking-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    h1 { margin: 0; font-size: 28px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>💰 New Booking Received!</h1>
  </div>

  <div class="content">
    <h2>Hi ${data.hostName},</h2>
    <p>You have a new booking for <strong>${data.propertyName}</strong>!</p>

    <div class="booking-details">
      <p><strong>Guest:</strong> ${data.guestName}</p>
      <p><strong>Email:</strong> ${data.guestEmail}</p>
      <p><strong>Check-in:</strong> ${new Date(data.checkIn).toLocaleDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(data.checkOut).toLocaleDateString()}</p>
      <p><strong>Nights:</strong> ${data.nights}</p>
      <p><strong>Guests:</strong> ${data.totalGuests}</p>
      <p><strong>Total:</strong> ${data.currency} ${data.totalPrice.toFixed(2)}</p>
    </div>

    <p>The guest will receive a confirmation email shortly.</p>
  </div>
</body>
</html>
  `
}

function cancellationTemplate(data: BookingEmailData & { refundAmount?: number }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #dc3545;
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    h1 { margin: 0; font-size: 28px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Booking Cancelled</h1>
  </div>

  <div class="content">
    <h2>Hi ${data.guestName},</h2>
    <p>Your booking for <strong>${data.propertyName}</strong> has been cancelled.</p>

    <p><strong>Booking ID:</strong> #${data.bookingId.slice(0, 8)}</p>
    <p><strong>Check-in date:</strong> ${new Date(data.checkIn).toLocaleDateString()}</p>

    ${data.refundAmount && data.refundAmount > 0 ? `
      <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; color: #155724;">
        <strong>Refund Amount:</strong> ${data.currency} ${data.refundAmount.toFixed(2)}<br>
        <small>Your refund will be processed within 5-10 business days.</small>
      </div>
    ` : `
      <p style="color: #856404; background: #fff3cd; padding: 15px; border-radius: 8px;">
        No refund is applicable for this cancellation based on our cancellation policy.
      </p>
    `}

    <p>If you have any questions, please contact us.</p>
  </div>
</body>
</html>
  `
}

function checkInReminderTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #17a2b8;
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    h1 { margin: 0; font-size: 28px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⏰ Check-in Tomorrow!</h1>
  </div>

  <div class="content">
    <h2>Hi ${data.guestName},</h2>
    <p>This is a friendly reminder that your check-in is <strong>tomorrow</strong>!</p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">📍 ${data.propertyName}</h3>
      <p>${data.propertyAddress}</p>
      <p><strong>Check-in:</strong> ${new Date(data.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <h3>Before You Go:</h3>
    <ul>
      <li>Review the check-in instructions from your host</li>
      <li>Confirm your arrival time</li>
      <li>Prepare your ID and booking confirmation</li>
    </ul>

    <p><strong>Host Contact:</strong><br>
    ${data.hostName} - ${data.hostEmail}</p>

    <p>Have a wonderful stay!</p>
  </div>
</body>
</html>
  `
}

export default resend
