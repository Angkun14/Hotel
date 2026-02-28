"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";

function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH").format(Math.max(0, Math.round(n)));
}

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.id as string;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "details" | "amenities" | "policies"
  >("details");

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    if (!hotelId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. ดึง hotel
        const hotelRes = await fetch(`http://localhost:3001/hotels/${hotelId}`);
        if (!hotelRes.ok) throw new Error("Hotel not found");
        const hotelData = await hotelRes.json();

        // 2. ดึง rooms ของ hotel นี้
        const roomsRes = await fetch(
          `http://localhost:3001/rooms/hotel/${hotelId}`,
        );
        const roomsData = await roomsRes.json();
        
        // 3. รวม rooms เข้า hotel
        setHotel({
          ...hotelData,
          rooms: roomsData,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  if (loading) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  if (error || !hotel) {
    return (
      <div className="pt-40 text-center text-red-500">ไม่พบข้อมูลโรงแรม</div>
    );
  }

  const selectedRoom = hotel.rooms?.find((r: any) => r._id === selectedRoomId);

  const taxAndFee = selectedRoom ? selectedRoom.price * 0.17 : 0;
  const totalPrice = selectedRoom ? selectedRoom.price + taxAndFee : 0;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <Header />

      {/* ================= HEADER SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <Link href="/" className="text-sm text-slate-500">
          ← กลับไปหน้าค้นหา
        </Link>

        <h1 className="text-4xl font-serif mt-4">{hotel.hotelName}</h1>

        <p className="text-slate-500 mt-2">{hotel.location}</p>

        <div className="mt-4 flex gap-4">
          <span className="text-[#B89146] font-bold">★ {hotel.rating}</span>
          <span className="text-slate-500">({hotel.reviews} รีวิว)</span>
        </div>
      </div>

      {/* ================= ROOMS ================= */}
      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-12 gap-12">
        <div className="col-span-8">
          <h2 className="text-2xl font-serif mb-6">ประเภทห้องพัก</h2>

          <div className="space-y-4">
            {hotel.rooms?.map((room: any) => (
              <div
                key={room._id}
                className={`border p-6 rounded-lg flex justify-between items-center ${
                  selectedRoomId === room._id
                    ? "border-[#B89146]"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg">{room.name}</h3>
                  <p className="text-sm text-slate-500">
                    {room.size} • {room.capacity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-[#B89146]">
                    ฿{formatBaht(room.price)}
                  </p>

                  <button
                    onClick={() => setSelectedRoomId(room._id)}
                    className="mt-2 border px-4 py-2 text-sm"
                  >
                    เลือกห้อง
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOOKING SUMMARY ================= */}
        <div className="col-span-4">
          <div className="sticky top-28 border p-6 rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-bold mb-4">สรุปการจอง</h3>

            {selectedRoom ? (
              <>
                <p className="mb-2">{selectedRoom.name}</p>

                <div className="flex justify-between">
                  <span>ราคา</span>
                  <span>฿{formatBaht(selectedRoom.price)}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-500">
                  <span>ภาษี 17%</span>
                  <span>฿{formatBaht(taxAndFee)}</span>
                </div>

                <div className="flex justify-between mt-4 font-bold text-lg">
                  <span>รวม</span>
                  <span>฿{formatBaht(totalPrice)}</span>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/checkout?hotelId=${hotel._id}&roomId=${selectedRoom._id}`,
                    )
                  }
                  className="mt-6 w-full bg-black text-white py-3"
                >
                  ไปชำระเงิน →
                </button>
              </>
            ) : (
              <p className="text-slate-400">กรุณาเลือกห้องพัก</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
