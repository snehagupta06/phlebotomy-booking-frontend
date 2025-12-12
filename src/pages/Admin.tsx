// src/pages/Admin.tsx (replacement)
import React, { useEffect, useState } from 'react'
import { createArea, createSlot } from '../api/api'
import { useApp } from '../contexts/AppContext'

type Slot = {
  id: string,
  area_id: string,
  slot_date: string,
  start_time: string,
  available_count: number
}

export default function Admin(){
  const { areas, refreshAreas } = useApp()
  const [areaName, setAreaName] = useState('')
  const [slotData, setSlotData] = useState({ area_id:'', slot_date:'', start_time:'09:00', available_count:1 })
  const [msg,setMsg] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [creatingArea, setCreatingArea] = useState(false)
  const [creatingSlot, setCreatingSlot] = useState(false)

  useEffect(()=>{ loadSlots() },[])

  async function loadSlots(){
    setLoadingSlots(true)
    try{
      const res = await fetch('/admin/slots')
      const json = await res.json()
      setSlots(json)
    }catch(e){
      console.error('Failed to fetch slots', e)
      setMsg('Failed to fetch slots')
    }finally{ setLoadingSlots(false) }
  }

  async function addArea(e:React.FormEvent){
    e.preventDefault()
    if (!areaName.trim()) { setMsg('Area name required'); return }
    setCreatingArea(true)
    try{
      await createArea({ name: areaName })
      setMsg('Area created')
      setAreaName('')
      await refreshAreas()       // update global areas (Home will reflect this)
      await loadSlots()          // refresh slots listing
    }catch(e:any){
      setMsg('Failed to create area: ' + (e.message || 'error'))
    }finally{ setCreatingArea(false) }
  }

  async function addSlot(e:React.FormEvent){
    e.preventDefault()
    if (!slotData.area_id) { setMsg('Please select area (use dropdown)'); return }
    setCreatingSlot(true)
    try{
      await createSlot(slotData)
      setMsg('Slot created')
      setSlotData({ area_id:'', slot_date:'', start_time:'09:00', available_count:1 })
      await loadSlots()
    }catch(e:any){
      setMsg('Failed to create slot: ' + (e.message || 'error'))
    }finally{ setCreatingSlot(false) }
  }

  // Group slots by area id for display
  const slotsByArea = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    (acc[s.area_id] ||= []).push(s)
    return acc
  }, {})

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-semibold text-brand-800">Admin Dashboard</h2>

      <section className="bg-white p-4 rounded shadow-card">
        <h3 className="font-medium mb-2">Create Area</h3>
        <form onSubmit={addArea} className="flex gap-3">
          <input value={areaName} onChange={e=>setAreaName(e.target.value)} placeholder="Area name" className="flex-1 border p-2 rounded input-focus"/>
          <button type="submit" className="px-3 py-2 bg-brand-500 text-white rounded" disabled={creatingArea}>
            {creatingArea ? 'Creating...' : 'Create'}
          </button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow-card">
        <h3 className="font-medium mb-3">Create Slot</h3>

        <form onSubmit={addSlot} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div className="md:col-span-1">
            <label className="text-xs text-gray-600">Area</label>
            <select className="w-full border p-2 rounded input-focus" value={slotData.area_id} onChange={e=>setSlotData({...slotData, area_id: e.target.value})}>
              <option value="">-- choose area --</option>
              {areas.map(a => (<option key={a.id} value={a.id}>{a.name} — {a.id.slice(0,8)}</option>))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600">Date</label>
            <input type="date" value={slotData.slot_date} onChange={e=>setSlotData({...slotData, slot_date: e.target.value})} className="w-full border p-2 rounded input-focus"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">Start time</label>
            <input type="time" value={slotData.start_time} onChange={e=>setSlotData({...slotData, start_time: e.target.value})} className="w-full border p-2 rounded input-focus"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">Capacity</label>
            <div className="flex gap-2">
              <input type="number" min={1} value={slotData.available_count} onChange={e=>setSlotData({...slotData, available_count: parseInt(e.target.value||'1')})} className="w-full border p-2 rounded input-focus"/>
              <button className="px-3 py-2 bg-brand-500 text-white rounded" disabled={creatingSlot}>
                {creatingSlot ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
        <div className="text-sm text-gray-500 mt-2">Tip: select the area from the dropdown (it uses the actual UUID internally).</div>
      </section>

      { msg && <div className="text-green-600">{msg}</div> }

      <section className="bg-white p-4 rounded shadow-card">
        <h3 className="font-medium mb-3">Existing Areas & Slots</h3>

        <div className="space-y-3">
          { areas.length === 0 && <div className="text-gray-600">No areas yet.</div> }

          { areas.map(a => (
            <div key={a.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-800">{a.name}</div>
                  <div className="text-xs text-gray-500">ID: <span className="font-mono text-sm">{a.id}</span></div>
                </div>
                <div className="text-sm text-gray-600">{(slotsByArea[a.id] || []).length} slot(s)</div>
              </div>

              <div className="mt-3">
                { (slotsByArea[a.id] || []).length === 0 ? (
                  <div className="text-sm text-gray-500">No slots for this area.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    { (slotsByArea[a.id] || []).map(s => (
                      <div key={s.id} className="p-2 border rounded bg-gray-50">
                        <div className="text-sm font-medium">{s.slot_date} • {s.start_time}</div>
                        <div className="text-xs text-gray-600">Slot ID: <span className="font-mono">{s.id}</span></div>
                        <div className="text-xs text-gray-600">Available: {s.available_count}</div>
                      </div>
                    )) }
                  </div>
                )}
              </div>
            </div>
          )) }
        </div>
      </section>
    </div>
  )
}
