'use client'
import { useEffect, useState } from 'react'

interface Booking {
  _id: string
  hotelName: string
  name: string
  price: number
  phone: string
  checkin: string
  checkout: string
}

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Bookings
      </h1>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {booking.hotelName}
            </h2>

            <div className="mt-4 space-y-1 text-gray-600">
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Price:</strong> ฿{booking.price}</p>
              <p>
                <strong>Check-in:</strong> {new Date(booking.checkin).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong> {new Date(booking.checkout).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}