import { sendBookingConfirmation } from './email';
import { sendBookingSMS } from './sms';
import { sendBookingWhatsApp } from './whatsapp';
import { format } from 'date-fns';

export interface NotificationData {
  email: string;
  phone?: string;
  whatsapp?: string;
  guestName: string;
  confirmationCode: string;
  roomTitle: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}

export async function sendAllNotifications(data: NotificationData) {
  const checkInStr = format(data.checkIn, 'MMM dd, yyyy');
  const checkOutStr = format(data.checkOut, 'MMM dd, yyyy');

  const results = {
    email: { success: false, mode: 'demo' as 'demo' | 'live' },
    sms: { success: false, mode: 'demo' as 'demo' | 'live' },
    whatsapp: { success: false, mode: 'demo' as 'demo' | 'live' },
  };

  // Send email notification
  const emailResult = await sendBookingConfirmation({
    to: data.email,
    guestName: data.guestName,
    confirmationCode: data.confirmationCode,
    roomTitle: data.roomTitle,
    checkIn: checkInStr,
    checkOut: checkOutStr,
    guests: data.guests,
    totalPrice: data.totalPrice,
  });
  results.email = {
    success: emailResult.success,
    mode: (emailResult as any).mode || 'live',
  };

  // Send SMS if phone number provided
  if (data.phone) {
    const smsResult = await sendBookingSMS({
      to: data.phone,
      guestName: data.guestName,
      confirmationCode: data.confirmationCode,
      roomTitle: data.roomTitle,
      checkIn: checkInStr,
      checkOut: checkOutStr,
    });
    results.sms = {
      success: smsResult.success,
      mode: (smsResult as any).mode || 'live',
    };
  }

  // Send WhatsApp if WhatsApp number provided
  if (data.whatsapp) {
    const whatsappResult = await sendBookingWhatsApp({
      to: data.whatsapp,
      guestName: data.guestName,
      confirmationCode: data.confirmationCode,
      roomTitle: data.roomTitle,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      totalPrice: data.totalPrice,
    });
    results.whatsapp = {
      success: whatsappResult.success,
      mode: (whatsappResult as any).mode || 'live',
    };
  }

  return results;
}
