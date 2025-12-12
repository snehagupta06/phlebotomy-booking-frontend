// src/components/BookingForm.tsx
import React, { useState } from 'react';
import { createBooking } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function BookingForm({ slot }: { slot: any }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !address.trim()) {
      setError('Name and address are required');
      return;
    }

    setLoading(true);
    try {
      const res = await createBooking({
        slot_id: slot.id,
        user_name: name.trim(),
        user_phone: phone.trim(),
        address: address.trim()
      });

      // Debug: print the full POST response to console so you can inspect it in DevTools
      console.log('POST /booking response:', res);

      // Server returns { status: 'PENDING', booking: { id: '...' , ... } }
      // Support both shapes: res.booking or res itself being the booking
      const booking = res.booking ?? res;
      if (!booking || !booking.id) {
        // If server didn't return booking.id, show a helpful message and log full response
        console.error('Missing booking id in response', res);
        setError('Booking created but server did not return a booking id. Check console/network.');
        setLoading(false);
        return;
      }

      // Navigate using the booking id returned by the backend
      navigate(`/booking/${booking.id}`);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Full name</label>
        <input className="w-full border p-3 rounded input-focus" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Phone</label>
        <input className="w-full border p-3 rounded input-focus" value={phone} onChange={e=>setPhone(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Address</label>
        <textarea className="w-full border p-3 rounded input-focus" value={address} onChange={e=>setAddress(e.target.value)} rows={3} />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-md shadow">
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}
