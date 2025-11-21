'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token })
      });

      if (res.ok) {
        setCancelled(true);
      } else {
        const err = await res.json();
        setError(err.error || 'Cancellation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (cancelled) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif mb-4">Booking Cancelled</h1>
        <p className="text-gray-500 mb-8">Your reservation has been successfully cancelled.</p>
        <a
          href="/"
          className="inline-block bg-gold text-white px-8 py-3 uppercase tracking-widest hover:bg-gold-dark transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <h1 className="text-4xl font-serif mb-8 text-center">Cancel Booking</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-8 shadow-xl border-t-4 border-gold text-center">
        <p className="text-gray-600 mb-8">
          Are you sure you want to cancel your booking? This action cannot be undone.
        </p>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Cancelling...' : 'Confirm Cancellation'}
        </button>

        <a
          href="/"
          className="block mt-4 text-gray-500 hover:text-gold transition-colors"
        >
          Keep my booking
        </a>
      </div>
    </div>
  );
}
