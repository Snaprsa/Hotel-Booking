"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get('code');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (confirmationCode) {
      fetchBooking();
    }
  }, [confirmationCode]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings?confirmationCode=${confirmationCode}`);
      const bookings = await res.json();
      if (bookings.length > 0) {
        setBooking(bookings[0]);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <p className="mb-8">We couldn't find a booking with that confirmation code.</p>
        <ButtonPrimary href="/">Go Home</ButtonPrimary>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Thank you for your booking. We've sent confirmation details to your email.
          </p>
        </div>

        {/* Confirmation Code */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-2xl p-8 mb-8 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Confirmation Code
          </p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            {booking.confirmationCode}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Please save this code. You'll need it for check-in.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-2xl font-semibold">Booking Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Room Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{booking.room.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{booking.room.address}</p>
            </div>

            {/* Stay Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Check-in</p>
                <p className="font-semibold">
                  {format(new Date(booking.checkIn), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-neutral-500">After 3:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Check-out</p>
                <p className="font-semibold">
                  {format(new Date(booking.checkOut), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-neutral-500">Before 11:00 AM</p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <h3 className="font-semibold mb-4">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Name</p>
                  <p className="font-medium">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">{booking.guestEmail}</p>
                </div>
                {booking.guestPhone && (
                  <div>
                    <p className="text-sm text-neutral-500">Phone</p>
                    <p className="font-medium">{booking.guestPhone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-neutral-500">Guests</p>
                  <p className="font-medium">
                    {booking.guestAdults} Adults
                    {booking.guestChildren > 0 && `, ${booking.guestChildren} Children`}
                    {booking.guestInfants > 0 && `, ${booking.guestInfants} Infants`}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="font-semibold mb-2">Special Requests</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{booking.specialRequests}</p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <h3 className="font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    ${booking.room.price} × {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Total</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-4">📬 Notifications Sent</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Email confirmation sent to {booking.guestEmail}</span>
            </li>
            {booking.guestPhone && (
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>SMS sent to {booking.guestPhone}</span>
              </li>
            )}
            {booking.guestWhatsapp && (
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>WhatsApp message sent to {booking.guestWhatsapp}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonPrimary href="/">Return to Home</ButtonPrimary>
          <ButtonPrimary href={`/my-bookings?email=${booking.guestEmail}`}>
            View My Bookings
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
