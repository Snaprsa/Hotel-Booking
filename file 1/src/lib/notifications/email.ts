import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailData {
  to: string;
  guestName: string;
  confirmationCode: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    // If no real API key, just log the email (demo mode)
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_demo_key') {
      console.log('📧 [DEMO MODE] Booking confirmation email would be sent to:', data.to);
      console.log('Confirmation Code:', data.confirmationCode);
      console.log('Room:', data.roomTitle);
      console.log('Check-in:', data.checkIn);
      console.log('Check-out:', data.checkOut);
      return { success: true, mode: 'demo' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'Hotel Booking <bookings@yourdomain.com>',
      to: data.to,
      subject: `Booking Confirmation - ${data.confirmationCode}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-label { font-weight: bold; }
              .confirmation-code { font-size: 24px; color: #2563eb; font-weight: bold; text-align: center; padding: 20px; background: #eff6ff; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Confirmed!</h1>
              </div>
              <div class="content">
                <p>Dear ${data.guestName},</p>
                <p>Thank you for choosing our hotel! Your booking has been confirmed.</p>

                <div class="confirmation-code">
                  Confirmation Code: ${data.confirmationCode}
                </div>

                <div class="booking-details">
                  <h2>Booking Details</h2>
                  <div class="detail-row">
                    <span class="detail-label">Room:</span>
                    <span>${data.roomTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span>${data.checkIn}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span>${data.checkOut}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Guests:</span>
                    <span>${data.guests}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Price:</span>
                    <span style="color: #2563eb; font-weight: bold;">$${data.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <p>Please keep this confirmation code for your records. You'll need it during check-in.</p>
                <p>We look forward to welcoming you!</p>
              </div>
              <div class="footer">
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>&copy; 2024 Hotel Booking. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully to:', data.to);
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error in sendBookingConfirmation:', error);
    return { success: false, error };
  }
}
