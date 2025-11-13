"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ButtonPrimary from '@/shared/ButtonPrimary';
import Input from '@/shared/Input';
import Label from '@/components/Label';
import Textarea from '@/shared/Textarea';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || '2';

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestWhatsapp: '',
    guestAdults: parseInt(guests) || 2,
    guestChildren: 0,
    guestInfants: 0,
    specialRequests: '',
  });

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
      const rooms = await res.json();
      const selectedRoom = rooms.find((r: any) => r.id === roomId);
      setRoom(selectedRoom);
    } catch (error) {
      console.error('Error fetching room:', error);
      setError('Failed to load room details');
    }
  };

  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return room.price * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to confirmation page
      router.push(`/booking-confirmation?code=${data.booking.confirmationCode}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!roomId || !checkIn || !checkOut) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid Booking Request</h1>
        <p className="mb-8">Please select a room and dates from our listings page.</p>
        <ButtonPrimary href="/listing-stay">Browse Rooms</ButtonPrimary>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading room details...</p>
      </div>
    );
  }

  const total = calculateTotal();
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    placeholder="john@example.com"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    Confirmation will be sent to this email
                  </p>
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+1234567890"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    For SMS notifications (optional)
                  </p>
                </div>

                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    type="tel"
                    value={formData.guestWhatsapp}
                    onChange={(e) => setFormData({ ...formData, guestWhatsapp: e.target.value })}
                    placeholder="+1234567890"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    For WhatsApp notifications (optional)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Adults</Label>
                    <Input
                      type="number"
                      min="1"
                      max={room.maxGuests}
                      value={formData.guestAdults}
                      onChange={(e) =>
                        setFormData({ ...formData, guestAdults: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.guestChildren}
                      onChange={(e) =>
                        setFormData({ ...formData, guestChildren: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Infants</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.guestInfants}
                      onChange={(e) =>
                        setFormData({ ...formData, guestInfants: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Special Requests (Optional)</Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Early check-in, late checkout, etc."
                    rows={4}
                  />
                </div>

                <ButtonPrimary type="submit" loading={loading} className="w-full">
                  {loading ? 'Processing...' : `Confirm Booking - $${total.toFixed(2)}`}
                </ButtonPrimary>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-6">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{room.title}</h3>
                  <p className="text-sm text-neutral-500">{room.address}</p>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Check-in</span>
                    <span className="font-medium">
                      {new Date(checkIn!).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Check-out</span>
                    <span className="font-medium">
                      {new Date(checkOut!).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Nights</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">
                      ${room.price} × {nights} nights
                    </span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Free cancellation</strong> up to 24 hours before check-in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
