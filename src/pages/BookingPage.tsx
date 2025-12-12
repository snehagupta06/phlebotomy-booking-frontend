// src/pages/BookingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBooking } from '../api/api';

export default function BookingPage() {
  const { id } = useParams<{id?: string}>();
  const [booking, setBooking] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function loadOnce() {
    if (!id) { setError('No booking id provided'); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await fetchBooking(id);
      setBooking(data.booking ?? data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Booking not found');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Poll until status becomes CONFIRMED or FAILED
  useEffect(() => {
    if (!booking) return;
    if (booking.status === 'CONFIRMED' || booking.status === 'FAILED') return;

    const t = setInterval(() => {
      loadOnce();
    }, 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-card">
      <div className="mb-4">
        <button onClick={()=>navigate('/')} className="text-sm text-brand-700 hover:underline">← Back</button>
      </div>

      {loading && <div className="text-gray-600">Loading booking...</div>}

      {!loading && error && (
        <div>
          <div className="text-red-600 font-medium mb-2"> {error} </div>
          <div className="text-sm text-gray-600 mb-3">If you just created a booking and see this, please open the browser DevTools Network tab and check the POST /booking response — the booking id must be used to open this page.</div>
          <div className="flex gap-2">
            <button onClick={()=>navigate('/')} className="px-3 py-2 rounded border">Back home</button>
          </div>
        </div>
      )}

      {!loading && booking && (
        <>
          <h2 className="text-xl font-semibold text-brand-800 mb-3">Booking Details</h2>

          <div className="space-y-2 text-gray-700">
            <div><strong>Booking ID:</strong> <span className="font-mono">{booking.id}</span></div>
            <div><strong>User:</strong> {booking.user_name}</div>
            <div><strong>Phone:</strong> {booking.user_phone}</div>
            <div><strong>Address:</strong> {booking.address}</div>
            <div><strong>Slot:</strong> {new Date(booking.slot_date).toLocaleDateString()} • {booking.start_time}</div>

            <div>
              <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded 
                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                {booking.status}
              </span>
            </div>
          </div>

          {booking.status === 'PENDING' && (
            <div className="mt-4 text-sm text-gray-500">
              Your booking is pending. This page will update automatically when the booking is confirmed or fails.
            </div>
          )}

          {booking.status === 'CONFIRMED' && (
            <div className="mt-4 text-green-700 font-medium">
              ✓ Your booking is confirmed. A phlebotomist will arrive in the chosen 1-hour window.
            </div>
          )}

          {booking.status === 'FAILED' && (
            <div className="mt-4 text-red-700 font-medium">
              ✗ Booking failed — the slot was already filled or reservation expired.
            </div>
          )}
        </>
      )}
    </div>
  );
}

