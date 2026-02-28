'use client'
import { useState } from 'react'

export default function BookingPage() {
  const [form, setForm] = useState({
    hotelName: '',
    name: '',
    price: '',
    phone: '',
    checkin: '',
    checkout: '',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await fetch('http://localhost:3001/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    alert('Booking Successful ✨')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Reserve Your Luxury Stay
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="hotelName"
            placeholder="Hotel Name"
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="name"
            placeholder="Your Full Name"
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <div className="flex gap-4">
            <input
              name="checkin"
              type="date"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />
            <input
              name="checkout"
              type="date"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  )
}