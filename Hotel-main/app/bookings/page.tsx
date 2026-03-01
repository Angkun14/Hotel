"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Booking {
  _id: string;
  bookingNo: string;
  hotelName: string;
  checkin: string;
  checkout: string;
  price: number;
  status: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("http://localhost:3001/bookings/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleCancel = async (bookingId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const result = await Swal.fire({
      title: "Cancel Reservation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B89146",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setCancelLoadingId(bookingId);

      await fetch(
        `http://localhost:3001/bookings/my/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      Swal.fire({
        title: "Cancelled",
        icon: "success",
        confirmButtonColor: "#B89146",
      });
    } catch {
      Swal.fire("Error", "Unable to cancel booking", "error");
    } finally {
      setCancelLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] px-6 md:px-20 py-20">
      
      {/* Title Section */}
      <div className="mb-16">
        <h1 className="text-5xl font-serif text-[#1A1A1A] tracking-wide">
          My Bookings
        </h1>
        <div className="w-16 h-[2px] bg-[#B89146] mt-4"></div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-[#E8E1D3] text-center">
          <p className="text-slate-500 text-lg">
            You have no reservations yet.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border border-[#E8E1D3] rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-10">

                {/* LEFT INFO */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Booking No
                  </p>
                  <p className="text-lg font-medium text-[#1A1A1A]">
                    {booking.bookingNo}
                  </p>

                  <h2 className="mt-6 text-2xl font-serif text-[#1A1A1A]">
                    {booking.hotelName}
                  </h2>

                  <p className="mt-4 text-slate-600">
                    {new Date(booking.checkin).toLocaleDateString("th-TH")} —{" "}
                    {new Date(booking.checkout).toLocaleDateString("th-TH")}
                  </p>
                </div>

                {/* RIGHT INFO */}
                <div className="text-right flex flex-col justify-between">
                  <div>
                    <p className="text-3xl font-serif text-[#B89146]">
                      ฿{booking.price?.toLocaleString()}
                    </p>

                    <p
                      className={`mt-3 text-sm uppercase tracking-widest font-medium ${
                        booking.status === "cancelled"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelLoadingId === booking._id}
                      className="mt-6 px-6 py-3 text-xs tracking-[0.3em] uppercase border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-full disabled:opacity-50"
                    >
                      {cancelLoadingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}