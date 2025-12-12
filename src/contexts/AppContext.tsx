// src/contexts/AppContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { fetchAreas as apiFetchAreas } from '../api/api'

type Area = { id: string, name: string }

type AppContextType = {
  areas: Area[],
  loading: boolean,
  refreshAreas: () => Promise<void>,
  setAreas: (areas: Area[]) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)

  const refreshAreas = async () => {
    setLoading(true)
    try {
      const a = await apiFetchAreas()
      setAreas(a)
    } catch (e) {
      console.error('Failed to fetch areas', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ refreshAreas() },[])

  return (
    <AppContext.Provider value={{ areas, loading, refreshAreas, setAreas }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = ()=> {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
