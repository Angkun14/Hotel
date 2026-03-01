"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Booking {
  _id: string;
  bookingNo: string;
  name: string;   
  user?: { name?: string };
  hotelName: string;
  checkin: string;
  checkout: string;
  price: number;
  status: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, search, status]);

  function checkAdmin() {
    const token = localStorage.getItem("access_token");
    if (!token) return router.replace("/login");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role !== "admin") router.replace("/");
    } catch {
      router.replace("/login");
    }
  }

  async function fetchData() {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `http://localhost:3001/bookings?page=${page}&limit=10&search=${search}&status=${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      setBookings(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setSummary(data?.summary || null);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Confirm แบบตรง ๆ เหมือนตอนแรก
  async function handleConfirm(id: string) {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(
      `http://localhost:3001/bookings/${id}/confirm`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Confirm failed");
    }

    fetchData(); // โหลดข้อมูลใหม่
  } catch (err) {
    console.error(err);
  }
}

  async function handleDelete(id: string) {
    const token = localStorage.getItem("access_token");

    await fetch(`http://localhost:3001/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchData();
  }

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] to-[#ece7dc] p-10 space-y-10">
      <h1 className="text-4xl font-serif text-[#B89146] tracking-wide">
        Admin Dashboard
      </h1>

      {summary && (
        <div className="grid md:grid-cols-4 gap-6">
          <LuxuryCard title="Total Revenue" value={`฿${summary.totalRevenue || 0}`} />
          <LuxuryCard title="Confirmed" value={summary.confirmed || 0} />
          <LuxuryCard title="Cancelled" value={summary.cancelled || 0} />
          <LuxuryCard title="Pending" value={summary.pending || 0} />
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center text-gray-950">
        <input
          placeholder="Search guest..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#B89146] outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-5 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#B89146] outline-none"
        >
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-[#e8e1d3] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f4efe6] text-gray-600">
            <tr>
              <th className="p-5 text-left">Booking</th>
              <th className="p-5 text-left">Guest</th>
              <th className="p-5 text-left">Price</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={b._id}
                className={`border-t transition hover:bg-[#faf7f1] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#fcfaf6]"
                }`}
              >
                <td className="p-5 font-medium text-gray-800">
                  {b.bookingNo}
                </td>

               <td className="p-5 text-gray-950 font-medium">{b.name}</td>
               

                {/* ❌ ปิดการแก้ราคา */}
                <td className="p-5 text-gray-700 font-medium">
                  ฿{b.price}
                </td>

                <td className="p-5">
                  <StatusBadge status={b.status} />
                </td>

                <td className="p-5 flex gap-2">
                  {b.status === "pending" && (
                    <button
                      onClick={() => handleConfirm(b._id)}
                      className="px-4 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Confirm
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg border transition ${
              page === i + 1
                ? "bg-[#B89146] text-white shadow-lg"
                : "bg-white hover:bg-[#f4efe6]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function LuxuryCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#e8e1d3] hover:scale-105 transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-3 text-[#B89146]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "confirmed"
      ? "bg-green-100 text-green-600"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}