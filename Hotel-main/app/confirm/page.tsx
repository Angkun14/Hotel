"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function formatBaht(n: number) {
  if (!n || isNaN(n)) return "0";
  return new Intl.NumberFormat("th-TH").format(Math.max(0, Math.round(n)));
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const diff = outDate.getTime() - inDate.getTime();
  const nights = diff / (1000 * 60 * 60 * 24);

  console.log("🛏 Calculate Nights:", {
    checkIn,
    checkOut,
    nights,
  });

  return nights > 0 ? nights : 0;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  console.log("📦 Query Params:", {
    hotelId,
    roomId,
    checkIn,
    checkOut,
  });

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("pay_at_hotel");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // =========================
  // VALIDATE DATE BEFORE LOAD
  // =========================
  useEffect(() => {
    console.log("🔎 Validate Date Effect Running");

    if (!hotelId || !roomId || !checkIn || !checkOut) {
      console.log("❌ Missing params");
      alert("กรุณาเลือกวัน Check-in และ Check-out");
      router.push("/");
      return;
    }

    const nights = calculateNights(checkIn, checkOut);

    if (nights <= 0) {
      console.log("❌ Invalid date range");
      alert("วันที่ Check-out ต้องมากกว่า Check-in");
      router.back();
      return;
    }

    console.log("✅ Date validation passed");
  }, [hotelId, roomId, checkIn, checkOut, router]);

  // =========================
  // FETCH BOOKING DATA
  // =========================
  useEffect(() => {
    if (!hotelId || !roomId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        console.log("🚀 Fetching booking data...");

        const res = await fetch(
          `http://localhost:3001/bookings/confirm-data?hotelId=${hotelId}&roomId=${roomId}`,
        );

        const data = await res.json();

        console.log("📥 API Response:", data);

        const roomPrice = Number(data.roomPrice) || 0;
        const nights = calculateNights(checkIn, checkOut);
        const roomCount = 1;

        const basePrice = roomPrice * nights * roomCount;
        const tax = basePrice * 0.07;
        const total = basePrice + tax;

        console.log("💰 Price Calculation:", {
          roomPrice,
          nights,
          basePrice,
          tax,
          total,
        });

        const finalData = {
          hotelId: String(hotelId),
          roomId: String(roomId),
          hotelName: data.hotelName || "Unknown Hotel",
          roomName: data.roomName || "Standard Room",
          roomCount,
          nights,
          roomPrice: basePrice,
          tax,
          total,
          checkIn,
          checkOut,
        };

        console.log("📦 Booking Data Set:", finalData);

        setBookingData(finalData);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [hotelId, roomId, checkIn, checkOut]);

  // =========================
  // CONFIRM BOOKING
  // =========================
  const handleConfirm = async () => {
    if (!bookingData) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการจอง");
      router.push("/login");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        hotelName: bookingData.hotelName,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        checkin: bookingData.checkIn,
        checkout: bookingData.checkOut,
        nights: bookingData.nights,
        price: Number(bookingData.total),
        paymentMethod,
        status: paymentMethod === "credit_card" ? "paid" : "pending_payment",
      };

      const res = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 เพิ่มบรรทัดนี้
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      window.location.href = `/success?id=${data._id}`;
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert("เกิดข้อผิดพลาดในการจอง");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="pt-40 text-center">Loading...</div>;

  if (!bookingData)
    return <div className="pt-40 text-center">ไม่พบข้อมูลการจอง</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-8 py-5"></div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT : Guest Information */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-[#e2d8c7] shadow-xl p-12">
              <h2 className="text-3xl font-serif text-[#B89146] mb-10">
                Guest Information
              </h2>

              <div className="space-y-6">
                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full h-14 px-5 rounded-xl
       border-2 border-[#d6c7b0]
       bg-[#faf8f3]
       text-gray-800 placeholder-gray-500
       focus:border-[#B89146]
       focus:ring-2 focus:ring-[#B89146]/30
       outline-none transition"
                />

                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full h-14 px-5 rounded-xl
       border-2 border-[#d6c7b0]
       bg-[#faf8f3]
       text-gray-800 placeholder-gray-500
       focus:border-[#B89146]
       focus:ring-2 focus:ring-[#B89146]/30
       outline-none transition"
                />

                <input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full h-14 px-5 rounded-xl
       border-2 border-[#d6c7b0]
       bg-[#faf8f3]
       text-gray-800 placeholder-gray-500
       focus:border-[#B89146]
       focus:ring-2 focus:ring-[#B89146]/30
       outline-none transition"
                />

                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full h-14 px-5 rounded-xl
       border-2 border-[#d6c7b0]
       bg-[#faf8f3]
       text-gray-800 placeholder-gray-500
       focus:border-[#B89146]
       focus:ring-2 focus:ring-[#B89146]/30
       outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* RIGHT : Reservation Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#e2d8c7] shadow-xl p-12 sticky top-24">
              <h2 className="text-3xl font-serif text-[#B89146] mb-10">
                Reservation Summary
              </h2>

              <div className="space-y-2 text-gray-800">
                <p className="font-medium">{bookingData.hotelName}</p>
                <p className="text-sm text-gray-500">{bookingData.roomName}</p>

                <p className="text-sm mt-4 font-medium">
                  {formatDate(bookingData.checkIn)} →{" "}
                  {formatDate(bookingData.checkOut)}
                </p>
              </div>

              <div className="border-t border-[#e2d8c7] my-8" />

              <div className="space-y-2 text-gray-700">
                <p>Nights: {bookingData.nights}</p>
                <p>Room Price: ฿{formatBaht(bookingData.roomPrice)}</p>
                <p>Tax: ฿{formatBaht(bookingData.tax)}</p>
              </div>

              <div className="mt-8 text-2xl font-bold text-black">
                Total: ฿{formatBaht(bookingData.total)}
              </div>

              <button
                onClick={handleConfirm}
                disabled={processing}
                className="w-full mt-10 bg-black hover:bg-[#B89146]
                     text-white py-4 rounded-xl
                     transition shadow-lg"
              >
                {processing ? "Processing..." : "Confirm Reservation"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
