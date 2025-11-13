"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Image from "next/image";

const AccountBookingsPage = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (emailParam) {
      fetchBookings(emailParam);
    }
  }, [emailParam]);

  const fetchBookings = async (emailAddress: string) => {
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(emailAddress)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
      console.error(err);
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

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Refresh bookings
      fetchBookings(email);
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isUpcoming = (checkIn: string) => {
    return new Date(checkIn) > new Date();
  };

  return (
    <div className="container pt-14 sm:pt-20 pb-24 lg:pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">My Bookings</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              View and manage your reservations
            </p>
          </div>

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <Label>Enter your email to view your bookings</Label>
              <div className="mt-1.5 flex gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <ButtonPrimary type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </ButtonPrimary>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading your bookings...</div>
            </div>
          )}

          {/* No Bookings */}
          {!loading && hasSearched && bookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">
                No bookings found for this email address.
              </p>
              <ButtonPrimary href="/" className="mt-4">
                Explore properties
              </ButtonPrimary>
            </div>
          )}

          {/* Bookings List */}
          {!loading && bookings.length > 0 && (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Property Image */}
                    <div className="flex-shrink-0 w-full sm:w-48">
                      <div className="aspect-w-16 aspect-h-12 sm:aspect-h-16 rounded-xl overflow-hidden">
                        <Image
                          fill
                          alt={booking.property.title}
                          className="object-cover"
                          src={booking.property.featuredImage}
                        />
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {booking.property.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          {booking.property.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">
                            Check-in
                          </p>
                          <p className="font-medium">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">
                            Check-out
                          </p>
                          <p className="font-medium">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">
                            Guests
                          </p>
                          <p className="font-medium">
                            {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">
                            Total
                          </p>
                          <p className="font-medium">
                            ${booking.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Booking ID
                          </p>
                          <p className="font-mono text-sm">
                            #{booking.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                          {booking.status === "confirmed" &&
                            isUpcoming(booking.checkIn) && (
                              <ButtonSecondary
                                onClick={() => handleCancelBooking(booking.id)}
                                className="!px-4 !py-2"
                              >
                                Cancel
                              </ButtonSecondary>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBookingsPage;
