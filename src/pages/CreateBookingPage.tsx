// src/pages/CreateBookingPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BookingForm from '../components/BookingForm'
import { fetchSlots } from '../api/api'

export default function CreateBookingPage() {
  const { slotId } = useParams<{ slotId?: string }>()
  const [slot, setSlot] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!slotId) { setError('No slot selected'); setLoading(false); return }
    // fetch slot details using fetchSlots(filter by slot id)
    // we don't have a dedicated GET /api/slot/:id, so we'll fetch all slots for the date and filter,
    // or if backend exposes GET /admin/slots we can use that. We'll try fetchSlots without params and find id.
    async function load() {
      setLoading(true)
      try {
        // try admin slots endpoint first (admin/slots returns rich slot objects)
        const adminRes = await fetch('/admin/slots')
        if (adminRes.ok) {
          const all = await adminRes.json()
          const s = all.find((x:any)=>x.id === slotId)
          if (s) { setSlot(s); setError(null); return }
        }
        // fallback: try fetchSlots() then match
        const all2 = await fetchSlots()
        const s2 = (all2 || []).find((x:any)=>x.id === slotId)
        if (s2) { setSlot(s2); setError(null); return }

        setError('Slot not found')
      } catch (err:any) {
        console.error('Load slot error', err)
        setError('Failed to load slot')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slotId])

  if (loading) return <div className="text-gray-600">Loading slot information...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!slot) return <div className="text-gray-600">Slot not found</div>

  // Render slot info and booking form
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-card">
      <div className="mb-4">
        <div className="text-sm text-gray-500">Booking — {slot.area_name}</div>
        <div className="text-lg font-semibold text-brand-800">{new Date(slot.slot_date).toLocaleDateString()} • {slot.start_time}</div>
      </div>

      <BookingForm slot={slot} />
    </div>
  )
}
