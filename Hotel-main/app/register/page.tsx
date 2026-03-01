"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (!formData.agree) {
      setErrorMsg("กรุณายอมรับเงื่อนไขการใช้งาน");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          agree: formData.agree,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "สมัครไม่สำเร็จ");
        return;
      }

      // ✅ สมัครสำเร็จ → ไปหน้า login
      router.push("/login");

    } catch (error) {
      setErrorMsg("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  };

  const inputStyle =
    "w-full border-b border-slate-300 py-3 bg-transparent text-[#1A1A1A] placeholder:text-slate-400 outline-none focus:border-[#B89146] transition-all duration-300";

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* ฝั่งซ้าย */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-12">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
            Join LUXE
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-5"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-medium">
            Experience Refined Elegance
          </p>
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:px-24 xl:py-16">

        <div className="mb-auto">
          <Link
            href="/"
            className="inline-flex items-center text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#B89146] transition"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto pt-10 pb-8">
          <h1 className="text-4xl font-serif text-[#1A1A1A] mb-3">
            Create Account
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-10">
            Become a Member
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">

            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                onChange={handleChange}
                className={inputStyle}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              required
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              required
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className={inputStyle}
            />

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="agree"
                onChange={handleChange}
                className="accent-[#B89146] w-4 h-4"
              />
              <label>ฉันยอมรับเงื่อนไขการใช้งาน</label>
            </div>

            {errorMsg && (
              <p className="text-rose-500 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[#B89146] transition-all duration-300"
            >
              Create Account
            </button>

          </form>
        </div>

        <div className="mt-auto text-center pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#B89146] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}