"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let role = "user";
    let fullName = "User Demo";

    if (email === "admin@gmail.com") {
      role = "admin";
      fullName = "Admin User";
    }

    // สร้าง fake token (demo)
    const payload = { role, email, fullName };
    const fakeToken = btoa(JSON.stringify(payload));

    // ✅ เก็บให้ Header อ่าน
    localStorage.setItem("access_token", fakeToken);
    localStorage.setItem(
      "user",
      JSON.stringify({ email, fullName, role })
    );

    // redirect
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }

    // ป้องกัน header ไม่รีเฟรช
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
          <Link href="/" className="inline-flex items-center text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#B89146]">
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