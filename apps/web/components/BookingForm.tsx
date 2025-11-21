'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  roomId: string;
  ratePlanId: string;
  startDate: string;
  endDate: string;
}

export default function BookingForm({ roomId, ratePlanId, startDate, endDate }: BookingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reservations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          ratePlanId,
          startDate,
          endDate,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          acceptTerms: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/success/${data.code}`);
      } else {
        const err = await res.json();
        setError(err.error || 'Booking failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-xl border-t-4 border-gold">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest mb-2">Full Name *</label>
        <input
          required
          className="w-full border p-3 focus:border-gold outline-none"
          value={form.guestName}
          onChange={e => setForm({ ...form, guestName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Email *</label>
          <input
            type="email"
            required
            className="w-full border p-3 focus:border-gold outline-none"
            value={form.guestEmail}
            onChange={e => setForm({ ...form, guestEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Phone</label>
          <input
            className="w-full border p-3 focus:border-gold outline-none"
            value={form.guestPhone}
            onChange={e => setForm({ ...form, guestPhone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <input
          type="checkbox"
          required
          id="terms"
          checked={form.acceptTerms}
          onChange={e => setForm({ ...form, acceptTerms: e.target.checked })}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the booking terms and cancellation policy (24h notice).
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-dark text-white py-4 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
      >
        {loading ? 'Confirming...' : 'Complete Reservation'}
      </button>
    </form>
  );
}
