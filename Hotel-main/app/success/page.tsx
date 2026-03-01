"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatBaht(n: number) {
  if (!n || isNaN(n)) return "0";
  return new Intl.NumberFormat("th-TH").format(
    Math.max(0, Math.round(n))
  );
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [bookingDetails, setBookingDetails] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!bookingId) {
    setLoading(false);
    return;
  }

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(
        `http://localhost:3001/bookings/my/${bookingId}`, // ✅ แก้ตรงนี้
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking not found");
      }

      setBookingDetails(data);
    } catch (error) {
      console.error("Fetch booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBooking();
}, [bookingId]);

  if (loading)
    return <div className="pt-40 text-center">Loading...</div>;

  if (!bookingDetails)
    return (
      <div className="pt-40 text-center">
        ไม่พบข้อมูลการจอง
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-[#B89146] selection:text-white">
      
      {/* Header */}
      <header className="w-full py-6 flex justify-center border-b border-[#EAE5D9]/50 bg-white/50 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146]">
            LUXE
          </span>
          <span className="text-2xl font-light tracking-[0.1em] text-slate-300">
            |
          </span>
          <span className="text-xl font-light tracking-widest text-[#1A1A1A]">
            STAY
          </span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          
          <div className="bg-white rounded-[2px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#F0EAD6] p-10 sm:p-16 text-center relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#D4AF37] via-[#B89146] to-[#D4AF37]"></div>

            {/* Check Icon */}
            <div className="mx-auto w-24 h-24 mb-8 rounded-full border border-[#B89146]/30 flex items-center justify-center bg-[#FAF9F6]">
              <svg 
                className="w-10 h-10 text-[#B89146]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight mb-4">
              Reservation Confirmed
            </h1>

            <p className="text-slate-500 font-light mb-10 leading-relaxed">
              Thank you,{" "}
              <span className="text-[#1A1A1A] font-medium">
                {bookingDetails.name}
              </span>.
              <br className="hidden sm:block" />
              Your booking is complete.
            </p>

            {/* Booking Summary */}
            <div className="bg-[#FAF9F6] border border-[#EAE5D9] p-6 sm:p-8 text-left mb-10">
              <div className="flex justify-between items-end border-b border-[#EAE5D9] pb-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Booking Reference
                  </p>
                  <p className="font-serif text-xl text-[#B89146]">
                    #{bookingDetails._id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Total Paid
                  </p>
                  <p className="font-serif text-xl text-[#1A1A1A]">
                    ฿{formatBaht(bookingDetails.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Hotel
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {bookingDetails.hotelName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Dates
                  </p>
                  <p className="text-sm font-light text-slate-800">
                    <span className="font-medium">In:</span>{" "}
                    {bookingDetails.checkIn}
                  </p>
                  <p className="text-sm font-light text-slate-800">
                    <span className="font-medium">Out:</span>{" "}
                    {bookingDetails.checkOut}
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                Status:{" "}
                <span className="font-medium text-[#B89146]">
                  {bookingDetails.status}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/bookings" 
                className="px-8 py-4 bg-[#1A1A1A] text-white text-[11px] uppercase tracking-[0.2em] hover:bg-[#B89146] transition-colors duration-300 w-full sm:w-auto text-center"
              >
                View My Bookings
              </Link>

              <Link 
                href="/" 
                className="px-8 py-4 bg-transparent border border-slate-300 text-slate-600 text-[11px] uppercase tracking-[0.2em] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-300 w-full sm:w-auto text-center"
              >
                Return to Home
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}