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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    if (!hotelId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const hotelRes = await fetch(`http://localhost:3001/hotels/${hotelId}`);
        if (!hotelRes.ok) throw new Error("Hotel not found");
        const hotelData = await hotelRes.json();

        const roomsRes = await fetch(
          `http://localhost:3001/rooms/hotel/${hotelId}`
        );
        if (!roomsRes.ok) throw new Error("Rooms not found");
        const roomsData = await roomsRes.json();

        setHotel({ ...hotelData, rooms: roomsData });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  if (loading) return <div className="pt-40 text-center">Loading...</div>;

  if (error || !hotel)
    return (
      <div className="pt-40 text-center text-red-500">
        ไม่พบข้อมูลโรงแรม
      </div>
    );

  const selectedRoom = hotel.rooms?.find(
    (r: any) => r._id === selectedRoomId
  );

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff =
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const basePrice = selectedRoom ? selectedRoom.price * nights : 0;
  const taxAndFee = basePrice * 0.07;
  const totalPrice = basePrice + taxAndFee;

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1A1A1A] pb-32">
      <Header />

      {/* HERO (ไม่มีรูป) */}
      <div className="relative h-[420px] w-full bg-[#F3EFE7] flex items-center justify-center border-b border-[#E8E1D3]">
        <div className="text-center">
          <h1 className="text-5xl font-serif tracking-wide mb-4">
            {hotel.hotelName}
          </h1>
          <p className="tracking-widest uppercase text-sm text-[#B89146]">
            {hotel.location}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-12 gap-16">
        {/* ห้องพัก */}
        <div className="col-span-8">
          {/* Date Picker */}
          <div className="mb-10 flex gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 text-slate-500">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border border-[#E8E1D3] bg-white px-4 py-2"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 text-slate-500">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border border-[#E8E1D3] bg-white px-4 py-2"
              />
            </div>
          </div>

          <h2 className="text-3xl font-serif mb-8 tracking-wide">
            Room Selection
          </h2>

          <div className="space-y-6">
            {hotel.rooms?.map((room: any) => (
              <div
                key={room._id}
                className={`rounded-2xl p-8 flex justify-between items-center transition-all duration-300 ${
                  selectedRoomId === room._id
                    ? "border border-[#B89146] bg-[#FDFBF6] shadow-lg"
                    : "border border-[#E8E1D3] bg-white hover:shadow-lg"
                }`}
              >
                <div>
                  <h3 className="font-serif text-xl mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {room.size} • {room.capacity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-serif text-[#B89146]">
                    ฿{formatBaht(room.price)}
                  </p>

                  <button
                    onClick={() => setSelectedRoomId(room._id)}
                    className="mt-4 px-8 py-3 text-xs tracking-[0.3em] uppercase border border-black hover:bg-black hover:text-white transition-all"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="col-span-4">
          <div className="sticky top-32 rounded-2xl bg-white p-8 shadow-2xl border border-[#E8E1D3]">
            <h3 className="text-xl font-serif mb-6 tracking-wide">
              Booking Summary
            </h3>

            {selectedRoom ? (
              <>
                <p className="mb-4 font-medium">
                  {selectedRoom.name}
                </p>

                <div className="flex justify-between mb-2">
                  <span>
                    {nights} คืน x ฿
                    {formatBaht(selectedRoom.price)}
                  </span>
                  <span>
                    ฿{formatBaht(basePrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-slate-500 mb-4">
                  <span>Tax 7%</span>
                  <span>
                    ฿{formatBaht(taxAndFee)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>
                    ฿{formatBaht(totalPrice)}
                  </span>
                </div>

                <button
                  disabled={
                    !selectedRoom ||
                    !checkIn ||
                    !checkOut ||
                    nights <= 0
                  }
                  onClick={() =>
                    router.push(
                      `/confirm?hotelId=${hotel._id}&roomId=${selectedRoom._id}&checkIn=${checkIn}&checkOut=${checkOut}`
                    )
                  }
                  className="mt-8 w-full bg-black text-white py-4 tracking-widest uppercase text-sm hover:bg-[#B89146] transition-all disabled:opacity-50"
                >
                  Proceed to Payment →
                </button>
              </>
            ) : (
              <p className="text-slate-400">
                Please select a room
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}