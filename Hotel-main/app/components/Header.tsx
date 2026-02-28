"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    window.location.reload();
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146]">
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
              className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-medium text-[#1A1A1A]"
            >
              <div className="w-8 h-8 bg-[#B89146] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <span>{user.fullName}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-4 w-48 bg-white border shadow-lg py-2 rounded-md">

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-gray-100"
                  >
                    👑 Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 text-rose-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider font-medium">
            <Link
              href="/login"
              className="text-[#1A1A1A] hover:text-[#B89146] transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="border border-[#B89146] px-4 py-1.5 text-[#B89146] hover:bg-[#B89146] hover:text-white transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}