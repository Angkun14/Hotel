"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/app/context/AuthContext"; // ✅ เพิ่ม

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth(); // ✅ ดึง setUser มาใช้

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Login failed");
        return;
      }

      const data = await res.json();

      // ✅ เก็บ token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // ✅ decode
      const decoded: any = jwtDecode(data.access_token);

      const userData = {
        id: decoded.sub || decoded.id,
        email: decoded.email,
        fullName: decoded.fullName,
      };

      // ✅ เก็บ user ไว้ใน localStorage (AuthProvider จะโหลดตอน refresh)
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔥 สำคัญมาก
      setUser(userData);

      // redirect
      if (decoded.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white selection:bg-[#B89146] selection:text-white">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80"
          alt="Luxury Resort Pool"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-12">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
            Welcome Back
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-5"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-medium">
            The Art of Luxury Living
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:px-24 xl:py-16">
        <div className="mb-auto">
          <Link
            href="/"
            className="inline-flex items-center text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#B89146]"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto pt-10 pb-8">
          <h1 className="text-4xl font-serif text-[#1A1A1A] mb-3">Sign In</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-10">
            Exclusive Member Access
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border-b border-slate-200 py-2 bg-transparent outline-none focus:border-[#B89146]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full border-b border-slate-200 py-2 bg-transparent outline-none focus:border-[#B89146]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[#B89146]"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="mt-auto text-center pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            New to LUXE STAY?{" "}
            <Link href="/register" className="text-[#B89146] font-bold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}