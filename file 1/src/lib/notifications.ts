import {
  sendBookingConfirmationEmail,
  sendHostNotificationEmail,
  sendCancellationEmail,
  sendCheckInReminderEmail,
  BookingEmailData,
} from './email'
import {
  sendWhatsAppConfirmation,
  sendWhatsAppCancellation,
  sendWhatsAppReminder,
  sendWhatsAppHostNotification,
  WhatsAppMessageData,
} from './whatsapp'
import { prisma } from './prisma'
import { Booking, Property, User } from '@prisma/client'

interface BookingWithRelations extends Booking {
  property: Property & {
    host: User
  }
  guest: User
}

/**
 * Send all notifications for a new booking (Email + WhatsApp)
 */
export async function sendBookingNotifications(booking: BookingWithRelations) {
  const notifications = []

  // Prepare data for notifications
  const emailData: BookingEmailData = {
    bookingId: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    propertyName: booking.property.title,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    nights: booking.nights,
    totalGuests: booking.totalGuests,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    propertyAddress: booking.property.address,
    hostName: booking.property.host.name || 'Host',
    hostEmail: booking.property.host.email,
  }

  const whatsappData: WhatsAppMessageData = {
    bookingId: booking.id,
    guestName: booking.guestName,
    guestPhone: booking.guestPhone,
    propertyName: booking.property.title,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    nights: booking.nights,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    hostName: booking.property.host.name || 'Host',
  }

  // Send email to guest
  const guestEmail = await sendBookingConfirmationEmail(emailData)
  notifications.push({
    type: 'EMAIL' as const,
    recipient: booking.guestEmail,
    status: guestEmail.success ? 'SENT' : 'FAILED',
    emailId: guestEmail.emailId,
  })

  // Send email to host
  const hostEmail = await sendHostNotificationEmail(emailData)
  notifications.push({
    type: 'EMAIL' as const,
    recipient: booking.property.host.email,
    status: hostEmail.success ? 'SENT' : 'FAILED',
    emailId: hostEmail.emailId,
  })

  // Send WhatsApp to guest (if phone number provided)
  if (booking.guestPhone) {
    const guestWhatsApp = await sendWhatsAppConfirmation(whatsappData)
    notifications.push({
      type: 'WHATSAPP' as const,
      recipient: booking.guestPhone,
      status: guestWhatsApp.success ? 'SENT' : 'FAILED',
      whatsappId: guestWhatsApp.messageSid,
    })
  }

  // Send WhatsApp to host (if phone number available)
  if (booking.property.host.phone) {
    const hostWhatsApp = await sendWhatsAppHostNotification({
      ...whatsappData,
      hostPhone: booking.property.host.phone,
    })
    notifications.push({
      type: 'WHATSAPP' as const,
      recipient: booking.property.host.phone,
      status: hostWhatsApp.success ? 'SENT' : 'FAILED',
      whatsappId: hostWhatsApp.messageSid,
    })
  }

  // Save notifications to database
  for (const notif of notifications) {
    try {
      await prisma.bookingNotification.create({
        data: {
          bookingId: booking.id,
          type: notif.type,
          recipient: notif.recipient,
          subject: notif.type === 'EMAIL' ? 'Booking Confirmation' : undefined,
          message: 'Booking confirmation notification',
          status: notif.status,
          sentAt: notif.status === 'SENT' ? new Date() : undefined,
          emailId: notif.emailId,
          whatsappId: notif.whatsappId,
        },
      })
    } catch (error) {
      console.error('Error saving notification to database:', error)
    }
  }

  return notifications
}

/**
 * Send cancellation notifications
 */
export async function sendCancellationNotifications(
  booking: BookingWithRelations,
  refundAmount: number = 0
) {
  const notifications = []

  const emailData: BookingEmailData & { refundAmount?: number } = {
    bookingId: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    propertyName: booking.property.title,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    nights: booking.nights,
    totalGuests: booking.totalGuests,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    propertyAddress: booking.property.address,
    hostName: booking.property.host.name || 'Host',
    hostEmail: booking.property.host.email,
    refundAmount,
  }

  // Send cancellation email
  const email = await sendCancellationEmail(emailData)
  notifications.push({
    type: 'EMAIL' as const,
    recipient: booking.guestEmail,
    status: email.success ? 'SENT' : 'FAILED',
    emailId: email.emailId,
  })

  // Send WhatsApp notification
  if (booking.guestPhone) {
    const whatsapp = await sendWhatsAppCancellation({
      bookingId: booking.id,
      guestName: booking.guestName,
      guestPhone: booking.guestPhone,
      propertyName: booking.property.title,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      nights: booking.nights,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      hostName: booking.property.host.name || 'Host',
      refundAmount,
    })
    notifications.push({
      type: 'WHATSAPP' as const,
      recipient: booking.guestPhone,
      status: whatsapp.success ? 'SENT' : 'FAILED',
      whatsappId: whatsapp.messageSid,
    })
  }

  // Save notifications to database
  for (const notif of notifications) {
    try {
      await prisma.bookingNotification.create({
        data: {
          bookingId: booking.id,
          type: notif.type,
          recipient: notif.recipient,
          subject: notif.type === 'EMAIL' ? 'Booking Cancellation' : undefined,
          message: 'Booking cancellation notification',
          status: notif.status,
          sentAt: notif.status === 'SENT' ? new Date() : undefined,
          emailId: notif.emailId,
          whatsappId: notif.whatsappId,
        },
      })
    } catch (error) {
      console.error('Error saving cancellation notification:', error)
    }
  }

  return notifications
}

/**
 * Send check-in reminder notifications (24 hours before)
 */
export async function sendCheckInReminders() {
  // Get all bookings with check-in tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      checkIn: {
        gte: tomorrow,
        lt: dayAfterTomorrow,
      },
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

  console.log(`Found ${bookings.length} bookings with check-in tomorrow`)

  for (const booking of bookings) {
    const emailData: BookingEmailData = {
      bookingId: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      propertyName: booking.property.title,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      nights: booking.nights,
      totalGuests: booking.totalGuests,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      propertyAddress: booking.property.address,
      hostName: booking.property.host.name || 'Host',
      hostEmail: booking.property.host.email,
    }

    // Send reminder email
    await sendCheckInReminderEmail(emailData)

    // Send reminder WhatsApp
    if (booking.guestPhone) {
      await sendWhatsAppReminder({
        bookingId: booking.id,
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
        propertyName: booking.property.title,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        nights: booking.nights,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        hostName: booking.property.host.name || 'Host',
      })
    }
  }

  return { sent: bookings.length }
}
