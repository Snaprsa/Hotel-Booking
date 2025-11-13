export function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDateRangeAvailable(
  existingBookings: { checkIn: Date; checkOut: Date; status: string }[],
  newCheckIn: Date,
  newCheckOut: Date
): boolean {
  for (const booking of existingBookings) {
    if (booking.status === 'cancelled') continue;

    // Check if dates overlap
    if (
      (newCheckIn >= booking.checkIn && newCheckIn < booking.checkOut) ||
      (newCheckOut > booking.checkIn && newCheckOut <= booking.checkOut) ||
      (newCheckIn <= booking.checkIn && newCheckOut >= booking.checkOut)
    ) {
      return false;
    }
  }
  return true;
}
