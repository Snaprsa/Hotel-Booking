export const generateOwnerAlertEmail = (booking: any, datesStr: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
    <div style="background: #1a1a1a; padding: 20px; text-align: center;">
      <h1 style="color: #c5a47e; margin: 0;">RAHA PLAZA</h1>
      <p style="color: #999; margin: 5px 0 0;">Owner Alert</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #333;">New Booking Received</h2>

      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <p><strong>Confirmation Code:</strong> ${booking.code}</p>
        <p><strong>Guest Name:</strong> ${booking.guestName}</p>
        <p><strong>Email:</strong> ${booking.guestEmail || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${booking.guestPhone || 'Not provided'}</p>
        <p><strong>Room:</strong> ${booking.room?.name || 'N/A'}</p>
        <p><strong>Dates:</strong> ${datesStr}</p>
        <p><strong>Total:</strong> SAR ${(booking.totalMinor / 100).toFixed(2)}</p>
      </div>

      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        This is an automated notification from the Raha Plaza booking system.
      </p>
    </div>
  </div>
</body>
</html>
`;
