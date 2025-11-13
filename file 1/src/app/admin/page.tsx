"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms'>('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all bookings
      const bookingsRes = await fetch('/api/bookings?userId=admin');
      // For admin, we'll need to modify the API to return all bookings
      // For now, we'll fetch rooms
      const roomsRes = await fetch('/api/rooms');
      const roomsData = await roomsRes.json();
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage bookings and rooms
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === 'rooms'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Rooms ({rooms.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> To view all bookings, please implement authentication and modify the API to fetch all bookings for admin users.
                Currently showing sample data structure.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Confirmation Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                        No bookings to display. Create a booking to see it here.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={room.featuredImage}
                      alt={room.title}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {room.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-500">Category</span>
                      <span className="font-medium">{room.category}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-500">Price/night</span>
                      <span className="font-bold text-lg">${room.price}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-500">Guests</span>
                        <p className="font-medium">{room.maxGuests}</p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Beds</span>
                        <p className="font-medium">{room.beds}</p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Baths</span>
                        <p className="font-medium">{room.bathrooms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
