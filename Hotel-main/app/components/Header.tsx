"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogoutClick() {
    logout();
    router.push("/");
  }

  function handleGoBookings() {
    router.push("/bookings");
    setUserMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif tracking-[0.25em] text-[#B89146]">
            LUXE
          </span>
          <span className="text-xl font-light tracking-widest text-[#1A1A1A]">
            Selection
          </span>
        </Link>

        {/* User Section */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 text-xs uppercase tracking-wider font-medium text-[#1A1A1A]"
            >
              <div className="w-9 h-9 bg-[#B89146] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <span>{user.fullName}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-[#e8e1d3] py-2">
                
                <button
                  onClick={handleGoBookings}
                  className="w-full text-left px-6 py-3 text-sm hover:bg-[#f8f6f1] text-[#B89146] font-medium transition"
                >
                  My Bookings
                </button>

                <div className="border-t border-[#e8e1d3] my-1" />

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-6 py-3 text-sm hover:bg-rose-50 text-rose-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider font-medium">
            <Link
              href="/login"
              className="text-[#1A1A1A] hover:text-[#B89146] transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="border border-[#B89146] px-4 py-2 rounded-full text-[#B89146] hover:bg-[#B89146] hover:text-white transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}