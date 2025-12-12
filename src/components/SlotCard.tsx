// src/components/SlotCard.tsx
import React from 'react'
import { Link } from 'react-router-dom';

export default function SlotCard({slot, onBook}:{slot:any, onBook:(s:any)=>void}){
  const available = slot.available_count ?? 0
  const isLow = available <= 1

  return (
    <div className="bg-white p-4 rounded-lg shadow-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-500">{slot.slot_date}</div>
            <div className="text-lg font-semibold text-brand-800">{slot.start_time}</div>
            <div className="text-sm text-gray-600 mt-1">{slot.area_name}</div>
          </div>

          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isLow ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
              {available} available
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Home visits typically take 20–30 minutes. Please ensure the address and phone number are correct.
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
  <div className="text-xs text-gray-500">1-hour window</div>

  <Link to={`/booking/create/${slot.id}`}
    className={`px-4 py-2 rounded-md font-medium ${slot.available_count > 0 ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
    Book
  </Link>
</div>
    </div>
  )
}
