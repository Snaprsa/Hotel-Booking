export const generateGuestEmail = (booking: any, icsUrl: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
    <div style="background: #1a1a1a; padding: 20px; text-align: center;">
      <h1 style="color: #c5a47e; margin: 0;">RAHA PLAZA</h1>
    </div>
    <div style="padding: 30px;">
      <h2>Booking Confirmed</h2>
      <p>Dear ${booking.guestName},</p>
      <p>We are delighted to confirm your stay.</p>

      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <p><strong>Confirmation Code:</strong> ${booking.code}</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toDateString()}</p>
        <p><strong>Total:</strong> SAR ${(booking.totalMinor / 100).toFixed(2)}</p>
      </div>

      <p style="text-align: center;">
        <a href="${icsUrl}" style="background: #c5a47e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Add to Calendar</a>
      </p>

      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        Cancellation allowed up to 24 hours before check-in.
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/cancel/${booking.cancelToken}">Click here to cancel</a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
