import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SMSData {
  to: string;
  guestName: string;
  confirmationCode: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
}

export async function sendBookingSMS(data: SMSData) {
  try {
    // If Twilio not configured, run in demo mode
    if (!client || !twilioPhone || accountSid?.startsWith('ACxxxx')) {
      console.log('📱 [DEMO MODE] SMS would be sent to:', data.to);
      console.log(`Hi ${data.guestName}! Your booking is confirmed. Confirmation code: ${data.confirmationCode}. Check-in: ${data.checkIn}. See you soon!`);
      return { success: true, mode: 'demo' };
    }

    const message = await client.messages.create({
      body: `Hi ${data.guestName}! Your hotel booking is confirmed.
Confirmation Code: ${data.confirmationCode}
Room: ${data.roomTitle}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
See you soon!`,
      from: twilioPhone,
      to: data.to,
    });

    console.log('✅ SMS sent successfully. SID:', message.sid);
    return { success: true, data: message };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
}
