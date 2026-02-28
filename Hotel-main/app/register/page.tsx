"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false, // ✅ เพิ่มตรงนี้
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // ✅ รองรับ checkbox
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
          agree: formData.agree, // ✅ ส่งเป็น boolean จริง
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "สมัครไม่สำเร็จ");
        return;
      }

      alert("สมัครสมาชิกสำเร็จ!");
    } catch (error) {
      setErrorMsg("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">

        <h2 className="text-3xl font-serif mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          {/* ✅ Checkbox ที่ถูกต้อง */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              onChange={handleChange}
            />
            <label>ฉันยอมรับเงื่อนไขการใช้งาน</label>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 mt-4"
          >
            Create Account
          </button>

        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}