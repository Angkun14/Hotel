"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// --- Types ---
type Room = {
  id: string;
  name: string;
  capacity: number;
  bed: string;
  refundable: boolean;
  breakfast: boolean;
  pricePerNight: number;
};

type Hotel = {
  id: string;
  name: string;
  city: string;
  stars: 3 | 4 | 5;
  rating: number;
  reviews: number;
  rooms: Room[];
};

// --- Helper Functions ---
function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH").format(Math.max(0, Math.round(n)));
}

export default function Home() {
  const router = useRouter();

  
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const [filters, setFilters] = useState({
    city: "เชียงใหม่",
    checkIn: todayStr,
    checkOut: tomorrowStr,
    guests: 2,
  });

  const [isSearching, setIsSearching] = useState(false);
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; 

  const handleSearch = () => {
    setIsSearching(true);
    const query = new URLSearchParams({
      city: filters.city,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests.toString()
    }).toString();

    setTimeout(() => {
      router.push(`/hotels?${query}`);
    }, 600);
  };

  // --- ข้อมูลโรงแรม 5 ดาว ---
  const recommended = [
    { 
      id: "four-seasons-cnx", 
      name: "Four Seasons Resort Chiang Mai", 
      area: "แม่ริม, เชียงใหม่", 
      price: 18500, 
      rating: 4.8, 
      reviews: 1452,
      tag: "Top Rated",
      image: "https://www.travelandleisure.com/thmb/SW4w4YJCLRHrfaaQPLjvB-lVu1w%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/TAL-header-exterior-villa-four-seasons-resort-chiang-mai-FSCHIANGMAI0325-be08e129b4c642f78b06f1125eb6e734.jpg" 
    },
    { 
      id: "anantara-cnx", 
      name: "Anantara Chiang Mai Resort", 
      area: "ช้างคลาน, เชียงใหม่", 
      price: 8200, 
      rating: 4.7, 
      reviews: 2184,
      tag: "Riverside",
      image: "https://images.trvl-media.com/lodging/2000000/1160000/1159700/1159643/db5bb5b7.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575" 
    },
    { 
      id: "137-pillars", 
      name: "137 Pillars House Chiang Mai", 
      area: "วัดเกต, เชียงใหม่", 
      price: 12800, 
      rating: 4.9, 
      reviews: 876,
      tag: "Boutique Luxury",
      image: "https://137pillarschiangmai.com/p/default_fb_image.jpg" 
    },
    { 
      id: "raya-heritage", 
      name: "Raya Heritage", 
      area: "แม่ริม, เชียงใหม่", 
      price: 9500, 
      rating: 4.8, 
      reviews: 645,
      tag: "Eco-Luxury",
      image: "https://www.rayaheritage.com/en/images/idx-column-accom.jpg" 
    },
    { 
      id: "chiang-mai-marriott", 
      name: "Chiang Mai Marriott Hotel", 
      area: "ช้างคลาน, เชียงใหม่", 
      price: 5816, 
      rating: 4.6, 
      reviews: 3512,
      tag: "Family Friendly",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/555565845.jpg?k=44ead5cd49f6b4d007a3beef64de11131f8b01bb6ffc029b2ccd2f434d03f88b&o=" 
    },
    { 
      id: "melia-cnx", 
      name: "Meliá Chiang Mai", 
      area: "ช้างคลาน, เชียงใหม่", 
      price: 4800, 
      rating: 4.7, 
      reviews: 1120,
      tag: "City Center",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/fa/9d/19/melia-chiang-mai.jpg?h=500&s=1&w=900" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#B89146] selection:text-white">
      
     

      {/* --- Hero & Search Section --- */}
      <section className="relative flex h-[90vh] items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80 z-10" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80')] bg-cover bg-center animate-slow-zoom" />
        </div>

        <div className="relative z-20 text-center text-white px-4 w-full mt-16">
          <div className="mb-6 flex justify-center items-center gap-4 animate-fade-in-up">
            <div className="w-12 h-px bg-[#D4AF37]"></div>
            <p className="font-light tracking-[0.4em] uppercase text-[#D4AF37] text-[10px]">
              The Art of Luxury Living
            </p>
            <div className="w-12 h-px bg-[#D4AF37]"></div>
          </div>
          <h1 className="mb-16 font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-wide animate-fade-in-up delay-100 drop-shadow-lg">
            Experience Elegance
          </h1>

          <div className="mx-auto w-full max-w-5xl animate-fade-in-up delay-200">
            <div className="flex flex-col md:flex-row bg-white/95 backdrop-blur-md p-1.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="flex-1 flex flex-col items-start px-8 py-5 border-b md:border-b-0 md:border-r border-slate-200 group cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#B89146] font-bold mb-2">Destination</span>
                <select
                  className="w-full text-[15px] font-serif outline-none text-[#1A1A1A] bg-transparent cursor-pointer"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                >
                  <option value="เชียงใหม่">Chiang Mai, Thailand</option>
                  <option value="กรุงเทพ">Bangkok, Thailand</option>
                  <option value="ภูเก็ต">Phuket, Thailand</option>
                  <option value="พัทยา">Pattaya, Thailand</option>
                </select>
              </div>

            

              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-[#1A1A1A] text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-[#B89146] flex items-center justify-center gap-3 w-full md:w-auto"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching</span>
                  </>
                ) : (
                  <>
                    <span>Discover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce z-20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7-7-7"></path>
          </svg>
        </div>
      </section>

      {/* --- Featured Content (ปรับขนาดเป็นมาตรฐาน) --- */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-24 bg-[#FDFCFB]">
        
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89146] font-bold mb-3">Curated Stays</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">Signature Collections</h2>
        </div>

        {/* --- แก้ไข: Grid ขนาดมาตรฐาน 3 คอลัมน์ รูปสัดส่วน 4:3 --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommended.map((hotel, index) => (
            <Link 
              key={hotel.id} 
              href={`/hotels/${hotel.id}`} 
              className="group flex flex-col cursor-pointer bg-white"
            >
              {/* เปลี่ยน aspect เป็น 4:3 ให้รูปกะทัดรัดขึ้น */}
              <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-slate-100">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                
                {hotel.tag && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] font-bold shadow-sm">
                    {hotel.tag}
                  </div>
                )}
              </div>
              
              {/* ปรับฟอนต์และช่องไฟให้พอดีกับการ์ดมาตรฐาน */}
              <div className="flex flex-col flex-grow px-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#D4AF37] text-[9px]">★★★★★</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">{hotel.reviews} Reviews</span>
                </div>
                
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-1.5 group-hover:text-[#B89146] transition-colors line-clamp-1">
                  {hotel.name}
                </h3>
                
                <p className="text-[11px] text-slate-500 font-light mb-5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#B89146]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {hotel.area}
                </p>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-[#EAE5D9]">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1">Starting From</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-serif text-[#1A1A1A]">฿{formatBaht(hotel.price)}</span>
                      <span className="text-[10px] text-slate-500 font-light">/ night</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] group-hover:text-[#B89146] transition-colors border-b border-transparent group-hover:border-[#B89146] pb-0.5">
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="mt-20 flex justify-center items-center gap-3">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-9 h-9 flex items-center justify-center border transition-colors ${currentPage === 1 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-[#EAE5D9] text-[#1A1A1A] hover:border-[#B89146] hover:text-[#B89146]'}`}
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 flex items-center justify-center text-[12px] font-serif transition-colors ${
                currentPage === page 
                  ? 'bg-[#1A1A1A] text-white border border-[#1A1A1A]' 
                  : 'bg-transparent text-[#1A1A1A] border border-transparent hover:border-[#EAE5D9]'
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 flex items-center justify-center border transition-colors ${currentPage === totalPages ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-[#EAE5D9] text-[#1A1A1A] hover:border-[#B89146] hover:text-[#B89146]'}`}
          >
            →
          </button>
        </div>

        {/* Banner Section */}
        <div className="mt-28 relative h-[350px] flex items-center justify-center bg-[#0F172A] rounded-sm overflow-hidden">
             <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Luxury Pool" />
             <div className="relative z-20 text-center text-white px-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-4 block">Privilege Member</span>
                <h3 className="font-serif text-3xl md:text-4xl mb-4 font-light">Unlock Exclusive Benefits</h3>
                <p className="font-light text-white/80 mb-8 max-w-md mx-auto text-[13px] leading-relaxed">Upgrade your stay with up to 15% off, complimentary room upgrades, and a dedicated personal concierge.</p>
                <Link href="/register" className="inline-block bg-white text-[#1A1A1A] px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#B89146] hover:text-white transition-colors font-bold">
                  Join The Club
                </Link>
             </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#0F172A] py-16 text-white/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4 border-b border-white/10 pb-12">
            <div className="col-span-1 md:col-span-2 pr-8">
              <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146] mb-5 block">LUXE</span>
              <p className="text-[12px] leading-loose font-light text-slate-400 max-w-md">
                Redefining the art of travel. We provide curated luxury experiences
                at the most prestigious locations across Thailand.
              </p>
            </div>
            <div>
               <h4 className="mb-6 text-[10px] uppercase tracking-[0.2em] text-white">Contact Us</h4>
               <p className="text-[12px] font-light text-slate-400 mb-2">+66 2 123 4567</p>
               <p className="text-[12px] font-light text-slate-400 mb-2">concierge@luxestay.com</p>
               <p className="text-[12px] font-light text-slate-400">Bangkok, Thailand</p>
            </div>
            <div>
               <h4 className="mb-6 text-[10px] uppercase tracking-[0.2em] text-white">Follow Us</h4>
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer text-xs">In</div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer text-xs">Fb</div>
               </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] text-slate-500">
            <p>© 2026 LUXE STAY GROUP. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}