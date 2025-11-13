import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface WhatsAppData {
  to: string;
  guestName: string;
  confirmationCode: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

export async function sendBookingWhatsApp(data: WhatsAppData) {
  try {
    // If Twilio not configured, run in demo mode
    if (!client || !twilioWhatsAppNumber || accountSid?.startsWith('ACxxxx')) {
      console.log('💬 [DEMO MODE] WhatsApp message would be sent to:', data.to);
      console.log(`
🏨 *Booking Confirmed!*

Hello ${data.guestName}!

Your hotel booking has been confirmed. Here are your booking details:

📋 *Confirmation Code:* ${data.confirmationCode}
🛏️ *Room:* ${data.roomTitle}
📅 *Check-in:* ${data.checkIn}
📅 *Check-out:* ${data.checkOut}
💰 *Total:* $${data.totalPrice.toFixed(2)}

Please save this confirmation code. You'll need it during check-in.

We look forward to welcoming you! 🎉
      `);
      return { success: true, mode: 'demo' };
    }

    // Ensure phone number has whatsapp: prefix
    const whatsappTo = data.to.startsWith('whatsapp:') ? data.to : `whatsapp:${data.to}`;

    const message = await client.messages.create({
      body: `🏨 *Booking Confirmed!*

Hello ${data.guestName}!

Your hotel booking has been confirmed. Here are your booking details:

📋 *Confirmation Code:* ${data.confirmationCode}
🛏️ *Room:* ${data.roomTitle}
📅 *Check-in:* ${data.checkIn}
📅 *Check-out:* ${data.checkOut}
💰 *Total:* $${data.totalPrice.toFixed(2)}

Please save this confirmation code. You'll need it during check-in.

We look forward to welcoming you! 🎉`,
      from: twilioWhatsAppNumber,
      to: whatsappTo,
    });

    console.log('✅ WhatsApp message sent successfully. SID:', message.sid);
    return { success: true, data: message };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error };
  }
}
