import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import BookingPage from './pages/BookingPage'
import CreateBookingPage from './pages/CreateBookingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-brand-50">
      <header className="bg-white/60 backdrop-blur-sm border-b border-white/60">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shadow">
              PH
            </div>
            <div>
              <div className="text-lg font-semibold text-brand-800">Phlebotomy Home Visit</div>
              <div className="text-xs text-gray-500">Safe & convenient sample collection at home</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-brand-700 hover:text-brand-900">Home</Link>
            <Link to="/admin" className="text-sm text-gray-600 hover:text-brand-700">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking/create/:slotId" element={<CreateBookingPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      </main>
    </div>
  )
}
