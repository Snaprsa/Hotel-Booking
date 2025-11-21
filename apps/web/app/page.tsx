'use client';

import { useState } from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import RoomCard from '@/components/RoomCard';

export default function Home() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          adults
        })
      });
      const data = await res.json();
      setRooms(data.rooms || []);
      setSearched(true);
    } catch (e) {
      alert('Error searching rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-0">
          <img src="/images/hero.jpg" className="w-full h-full object-cover opacity-60" alt="Hero" />
        </div>
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-serif mb-4">A Timeless Escape</h1>
          <p className="text-xl tracking-wider font-light">Experience elegance in the heart of Al Khobar</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white p-6 md:p-8 shadow-2xl rounded-sm border-t-4 border-gold flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Stay Dates</label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Guests</label>
            <select
              className="w-full border border-gray-200 p-3 focus:border-gold outline-none"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Adults</option>)}
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto bg-gold hover:bg-gold-dark text-white px-10 py-3 uppercase tracking-widest transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Check Availability'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-20">
        {searched && (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-center mb-12">Available Accommodations</h2>
            {rooms.length === 0 ? (
              <p className="text-center text-gray-500">No rooms available for these dates.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    nights={dateRange ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 1}
                    query={{ startDate: dateRange!.from, endDate: dateRange!.to, adults }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
