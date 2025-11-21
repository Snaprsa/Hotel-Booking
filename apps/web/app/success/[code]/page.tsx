import { prisma } from '@/lib/db';
import { formatPropertyDate } from '@/lib/tz';
import Link from 'next/link';

export default async function SuccessPage({ params }: { params: { code: string } }) {
  const reservation = await prisma.reservation.findUnique({
    where: { code: params.code },
    include: { room: true, ratePlan: true }
  });

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-serif mb-4">Booking Not Found</h1>
        <p className="text-gray-500">The booking code is invalid.</p>
      </div>
    );
  }

  const totalPrice = (reservation.totalMinor / 100).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif mb-4">Booking Confirmed</h1>
        <p className="text-gray-500">Your reservation has been successfully confirmed.</p>
      </div>

      <div className="bg-white p-8 shadow-xl border-t-4 border-gold">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gray-500">Confirmation Code</span>
          <h2 className="text-3xl font-bold text-gold">{reservation.code}</h2>
        </div>

        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Guest Name</span>
            <span className="font-semibold">{reservation.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Room</span>
            <span className="font-semibold">{reservation.room.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-in</span>
            <span className="font-semibold">{formatPropertyDate(reservation.checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-out</span>
            <span className="font-semibold">{formatPropertyDate(reservation.checkOut)}</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-gray-500">Total Amount</span>
            <span className="text-xl font-bold">SAR {totalPrice}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href={`/api/ics/${reservation.code}`}
            className="flex-1 text-center bg-dark text-white py-3 uppercase tracking-wider hover:bg-gold transition-colors"
          >
            Add to Calendar
          </a>
          <Link
            href="/"
            className="flex-1 text-center border border-dark py-3 uppercase tracking-wider hover:bg-dark hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm mt-8">
        A confirmation email has been sent to {reservation.guestEmail || 'your email'}.
      </p>
    </div>
  );
}
