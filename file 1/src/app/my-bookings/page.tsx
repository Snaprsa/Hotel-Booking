"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ButtonPrimary from '@/shared/ButtonPrimary';
import Input from '@/shared/Input';
import Label from '@/components/Label';
import { format } from 'date-fns';

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (emailParam) {
      fetchBookings(emailParam);
    }
  }, [emailParam]);

  const fetchBookings = async (searchEmail: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      fetchBookings(email);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refresh bookings
        fetchBookings(email);
        alert('Booking cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {/* Search Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label>Enter your email to view bookings</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <ButtonPrimary type="submit" loading={loading}>
                Search
              </ButtonPrimary>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">Loading bookings...</p>
          </div>
        )}

        {/* No Bookings */}
        {searched && !loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No bookings found</p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              You don't have any bookings with this email address.
            </p>
            <ButtonPrimary href="/listing-stay">Browse Rooms</ButtonPrimary>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{booking.room.title}</h3>
                      <p className="text-sm text-neutral-500">
                        Confirmation Code:{' '}
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {booking.confirmationCode}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )} mt-2 md:mt-0 inline-block`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-neutral-500">Check-in</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Check-out</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Total Price</p>
                      <p className="font-medium text-lg">${booking.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <ButtonPrimary
                      href={`/booking-confirmation?code=${booking.confirmationCode}`}
                      className="flex-1"
                    >
                      View Details
                    </ButtonPrimary>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
