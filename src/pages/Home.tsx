import React, { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { fetchSlots } from '../api/api'
import SlotCard from '../components/SlotCard'

export default function Home(){
  const { areas } = useApp()
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ if (areaId) load() },[areaId,date])
  async function load(){ setLoading(true); const s = await fetchSlots(areaId, date); setSlots(s); setLoading(false) }

  function onBook(slot:any){
    window.location.href = `/booking/${slot.id}?slotId=${slot.id}`
  }

  return (
    <div>
      <section className="bg-white rounded-lg p-6 mb-6 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-800 mb-1">Find Home Visit Slots</h2>
        <p className="text-sm text-gray-600 mb-4">Choose your area and preferred date. We’ll show available 1-hour windows.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Area</label>
            <select className="w-full border p-3 rounded bg-white input-focus" value={areaId ?? ''} onChange={e=>setAreaId(e.target.value || undefined)}>
              <option value=''>Select area</option>
              {areas.map((a:any)=>(<option key={a.id} value={a.id}>{a.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Date</label>
            <input type="date" className="w-full border p-3 rounded bg-white input-focus" value={date} onChange={e=>setDate(e.target.value)} />
          </div>

          <div className="flex items-end">
            <button onClick={load} className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-3 rounded shadow">Search</button>
          </div>
        </div>
      </section>

      <section>
        { loading ? <div className="text-gray-600">Loading slots...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            { slots.length === 0 ? <div className="text-gray-600 p-6">No slots found for this date/area.</div> : slots.map(s=> (
              <SlotCard key={s.id} slot={s} onBook={onBook} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
