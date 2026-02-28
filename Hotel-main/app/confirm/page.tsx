"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// --- Helper Functions ---
function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH").format(Math.max(0, Math.round(n)));
}

export default function CheckoutPage() {
  // State สำหรับฟอร์มและช่องทางการชำระเงิน
  const [paymentMethod, setPaymentMethod] = useState("pay_at_hotel");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    guests: "",
    requests: "",
  });

  

  // --- State สำหรับจัดการฟอร์มบัตรเครดิต ---
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันจัดการ Card Number (ตัวเลขเท่านั้น สูงสุด 16 ตัว)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  // ฟังก์ชันจัดการ Expiry Date (จัดรูปแบบ MM/YY และตรวจสอบบัตรหมดอายุ)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    useEffect(() => {
  if (!hotelId || !roomId) {
    setLoading(false);
    return;
  }

  const fetchBooking = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/confirm-data?hotelId=${hotelId}&roomId=${roomId}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setBookingData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBooking();
}, [hotelId, roomId]);

    // จัดรูปแบบให้เป็น MM/YY อัตโนมัติ
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setExpiryDate(value);

    // ตรวจสอบเงื่อนไขเมื่อกรอกครบ 5 ตัวอักษร (MM/YY)
    if (value.length === 5) {
      const currentYear = new Date().getFullYear() % 100; // ได้ปี ค.ศ. 2 หลัก (เช่น 26)
      const currentMonth = new Date().getMonth() + 1; // ได้เดือนปัจจุบัน (1-12)

      const expMonth = parseInt(value.substring(0, 2));
      const expYear = parseInt(value.substring(3, 5));

      // ตรวจสอบความถูกต้องของเดือนและปี
      if (expMonth < 1 || expMonth > 12) {
        setExpiryError("เดือนไม่ถูกต้อง (01-12)");
      } else if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        setExpiryError("บัตรใบนี้หมดอายุแล้ว");
      } else {
        setExpiryError(""); // ผ่านเงื่อนไข ลบข้อความ Error
      }
    } else {
      setExpiryError(""); // ซ่อน Error หากยังกรอกไม่ครบ
    }
  };

  if (loading) {
  return <div className="pt-40 text-center">Loading...</div>;
}

if (!bookingData) {
  return <div className="pt-40 text-center">ไม่พบข้อมูลการจอง</div>;
}

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col">
      {/* --- Header --- */}
      <header className="relative z-50 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146]">
              LUXE
            </span>
            <span className="text-2xl font-light tracking-[0.1em] text-slate-400">
              |
            </span>
            <span className="text-xl font-light tracking-widest text-slate-800">
              STAY
            </span>
          </Link>
          <nav className="hidden space-x-10 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-600 md:flex">
            <Link
              href="/hotels"
              className="hover:text-[#B89146] transition-colors"
            >
              Destinations
            </Link>
            <Link href="#" className="hover:text-[#B89146] transition-colors">
              Offers
            </Link>
            <Link href="#" className="hover:text-[#B89146] transition-colors">
              My Bookings
            </Link>
          </nav>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-8 py-12">
        {/* Breadcrumb & Stepper */}
        <div className="mb-12 w-full">
          <div className="flex w-full justify-start mb-8">
            <Link
              href="/hotels"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-[#B89146] transition-colors"
            >
              ← Back to Details
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] w-full max-w-3xl mx-auto">
            <span className="text-[#B89146] font-bold">1. Guest Details</span>
            <span className="flex-1 h-px bg-[#B89146]/30"></span>
            <span className="text-slate-800 font-bold">2. Payment</span>
            <span className="flex-1 h-px bg-slate-200"></span>
            <span className="text-slate-400">3. Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* --- Left Column: Forms (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 1: Guest Details */}
            <section>
              <h2 className="font-serif text-2xl font-light text-slate-800 mb-8 pb-4 border-b border-slate-200">
                Guest Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="text"
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Special Requests
                  </label>
                  <input
                    type="text"
                    value={formData.requests}
                    onChange={(e) =>
                      setFormData({ ...formData, requests: e.target.value })
                    }
                    placeholder="High floor, specific view, etc."
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Payment Method */}
            <section>
              <h2 className="font-serif text-3xl font-light text-slate-800 mb-8 pb-4 border-b border-slate-200">
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* 1. Pay at Hotel */}
                <div
                  onClick={() => setPaymentMethod("pay_at_hotel")}
                  className={`p-6 border cursor-pointer transition-all flex items-center justify-between group ${
                    paymentMethod === "pay_at_hotel"
                      ? "border-[#B89146] bg-[#FAF9F6]"
                      : "border-slate-200 hover:border-[#B89146]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "pay_at_hotel" ? "border-[#B89146]" : "border-slate-300"}`}
                    >
                      {paymentMethod === "pay_at_hotel" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>
                      )}
                    </div>
                    <div>
                      <h4
                        className={`font-serif text-lg transition-colors ${paymentMethod === "pay_at_hotel" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}
                      >
                        Pay at Hotel
                      </h4>
                      <p className="text-xs font-light text-slate-500 mt-1">
                        Settle your bill upon check-in
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`border cursor-pointer transition-all duration-300 overflow-hidden group ${
                    paymentMethod === "credit_card"
                      ? "border-[#B89146] bg-white shadow-md"
                      : "border-slate-200 hover:border-[#B89146]"
                  }`}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === "credit_card" ? "border-[#B89146]" : "border-slate-300"}`}
                      >
                        {paymentMethod === "credit_card" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-serif text-lg transition-colors ${paymentMethod === "credit_card" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}
                        >
                          Credit / Debit Card
                        </h4>
                        <p className="text-xs font-light text-slate-500 mt-1">
                          Pay securely via Stripe gateway
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-50 grayscale group-hover:grayscale-0 transition-all">
                      <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                      <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                    </div>
                  </div>

                  {/* --- ส่วนกรอกข้อมูลบัตร --- */}
                  {paymentMethod === "credit_card" && (
                    <div
                      className="px-6 pb-8 pt-2 border-t border-slate-100 bg-[#FAF9F6] animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-1 gap-6 mt-4">
                        {/* หมายเลขบัตร */}
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 tracking-widest"
                          />
                        </div>

                        {/* ชื่อเจ้าของบัตร */}
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            placeholder="YOUR NAME"
                            className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 uppercase"
                          />
                        </div>

                        {/* วันหมดอายุ และ CVC */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                              Expiry Date (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM / YY"
                              maxLength={5}
                              className={`w-full border-b py-2 bg-transparent outline-none transition-colors font-light text-center ${
                                expiryError
                                  ? "border-red-500 text-red-600 focus:border-red-500"
                                  : "border-slate-300 focus:border-[#B89146] text-slate-800 placeholder:text-slate-300"
                              }`}
                            />
                            {expiryError && (
                              <p className="text-red-500 text-[10px] mt-1">
                                {expiryError}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                              CVC (Back of Card)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="123"
                                maxLength={3}
                                onChange={(e) =>
                                  (e.target.value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  ))
                                }
                                className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 text-center"
                              />
                              <span className="absolute right-0 top-2 text-[10px] text-slate-400">
                                3 digits
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. PromptPay QR */}
                <div
                  onClick={() => setPaymentMethod("promptpay")}
                  className={`border cursor-pointer transition-all duration-300 overflow-hidden group ${
                    paymentMethod === "promptpay"
                      ? "border-[#B89146] bg-white shadow-md"
                      : "border-slate-200 hover:border-[#B89146]"
                  }`}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === "promptpay" ? "border-[#B89146]" : "border-slate-300"}`}
                      >
                        {paymentMethod === "promptpay" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-serif text-lg transition-colors ${paymentMethod === "promptpay" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}
                        >
                          PromptPay QR
                        </h4>
                        <p className="text-xs font-light text-slate-500 mt-1">
                          Scan to pay with any Thai banking app
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* --- ส่วน QR Code และอัปโหลด --- */}
                  {paymentMethod === "promptpay" && (
                    <div
                      className="px-6 pb-8 pt-2 border-t border-slate-100 bg-[#FAF9F6] animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col items-center mt-6">
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 mb-6">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            alt="PromptPay QR"
                            className="w-32 h-32 opacity-80"
                          />
                          <p className="text-center text-[10px] mt-2 uppercase tracking-widest text-slate-500">
                            Scan to Pay
                          </p>
                        </div>

                        <div className="w-full">
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 text-center">
                            Upload Proof of Payment (Slip)
                          </label>
                          <div className="relative border border-dashed border-slate-300 rounded-sm bg-white hover:bg-slate-50 transition-colors p-6 text-center group/upload">
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept="image/*"
                            />
                            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                              <span className="text-2xl text-slate-300 group-hover/upload:text-[#B89146] transition-colors">
                                ☁️
                              </span>
                              <span className="text-xs font-light text-slate-500">
                                Click to upload or drag and drop
                              </span>
                              <span className="text-[9px] text-slate-400">
                                JPG, PNG (Max 5MB)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* --- Right Column: Booking Summary (4 Cols) --- */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 bg-[#FAF9F6] border border-[#F0EAD6] p-8 shadow-sm">
              <h3 className="font-serif text-xl font-light text-slate-800 mb-6">
                Reservation Summary
              </h3>

              {/* Hotel Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-200 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                </div>
                <div>
                  <h4 className="font-serif text-slate-800 leading-tight">
                    {bookingData.hotelName}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                    {bookingData.location}
                  </p>
                  <p className="text-xs text-[#B89146] mt-1">
                    ★ {bookingData.rating}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#EAE5D9] my-6"></div>

              {/* Booking Details */}
              <ul className="space-y-4 text-sm font-light text-slate-600">
                <li className="flex justify-between">
                  <span>Room</span>
                  <span className="font-medium text-slate-800">
                    {bookingData.roomName} (x{bookingData.roomCount})
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Check In</span>
                  <span className="font-medium text-slate-800">
                    {bookingData.checkIn}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Check Out</span>
                  <span className="font-medium text-slate-800">
                    {bookingData.checkOut}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Length of Stay</span>
                  <span className="font-medium text-slate-800">
                    {bookingData.nights} Nights
                  </span>
                </li>
              </ul>

              <div className="border-t border-[#EAE5D9] my-6"></div>

              {/* Price Breakdown */}
              <ul className="space-y-3 text-sm font-light text-slate-600 mb-6">
                <li className="flex justify-between">
                  <span>Room Price</span>
                  <span>฿{formatBaht(bookingData.roomPrice)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Taxes & Fees (7%)</span>
                  <span>฿{formatBaht(bookingData.tax)}</span>
                </li>
              </ul>

              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                  Total Due
                </span>
                <span className="font-serif text-2xl text-[#B89146]">
                  ฿{formatBaht(bookingData.total)}
                </span>
              </div>

              <p className="text-[10px] text-green-600 mb-8 italic">
                ✓ Free cancellation before 18 Jan 2025
              </p>

              {/* Submit Button */}
              <button className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-[#B89146]">
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#0F172A] py-10 text-white/60 mt-auto">
        <div className="mx-auto max-w-7xl px-8 text-center text-[10px] uppercase tracking-widest">
          © 2026 LUXE STAY GROUP. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
