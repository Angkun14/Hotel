"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

type ApiHotel = {
  _id: string;
  hotelName: string;
  location: string;
  price: number;
  imageUrl?: string;
};

type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
};

export default function HotelSearchPage() {
  const searchParams = useSearchParams();
  const [apiData, setApiData] = useState<ApiHotel[]>([]);
  const [loading, setLoading] = useState(false);

  const searchedLocation =
    searchParams.get("location") ||
    searchParams.get("city") ||
    "All Destinations";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const location =
          searchParams.get("location") || searchParams.get("city") || "";

        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        const sortBy = searchParams.get("sortBy") || "";

        const query = new URLSearchParams({
          location,
          minPrice,
          maxPrice,
          sortBy,
        }).toString();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hotels/search?${query}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const result = await res.json();

        // ✅ backend ส่ง { data: [...] }
        setApiData(result.data || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setApiData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  const mappedHotels: Hotel[] = useMemo(() => {
    return apiData.map((api) => ({
      id: api._id,
      name: api.hotelName,
      location: api.location,
      price: api.price,
      image:
        api.imageUrl && api.imageUrl.startsWith("http")
          ? api.imageUrl
          : "https://via.placeholder.com/1000x600?text=Luxury+Hotel",
    }));
  }, [apiData]);

  const formatBaht = (n: number) =>
    new Intl.NumberFormat("th-TH").format(n);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 text-[#1A1A1A]">
      <Header />

      {/* Hero Section */}
      <div className="pt-36 pb-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif mb-6 tracking-wide capitalize">
          {searchedLocation}
        </h1>
        <p className="text-sm tracking-widest text-gray-500 uppercase">
          {loading
            ? "Searching luxury properties..."
            : `${mappedHotels.length} Exclusive Stays Available`}
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {loading && (
          <p className="text-center text-gray-400 animate-pulse">
            Loading properties...
          </p>
        )}

        {!loading && mappedHotels.length === 0 && (
          <p className="text-center text-gray-400">
            No hotels found for this location.
          </p>
        )}

        {!loading && mappedHotels.length > 0 && (
          <div className="space-y-16">
            {mappedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group flex flex-col lg:flex-row bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 aspect-[16/10] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/1000x600?text=Luxury+Hotel";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-serif mb-4 tracking-wide">
                      {hotel.name}
                    </h2>

                    <p className="text-sm text-gray-500 tracking-wide uppercase mb-6">
                      {hotel.location}
                    </p>

                    <div className="h-px bg-gray-200 my-8"></div>

                    <p className="text-4xl font-serif text-[#B89146]">
                      ฿{formatBaht(hotel.price)}
                    </p>
                    <p className="text-xs text-gray-400 tracking-widest uppercase mt-2">
                      Per Night
                    </p>
                  </div>

                  <div className="mt-10">
                    <Link
                      href={`/hotels/${hotel.id}`}
                      className="inline-block border border-black px-10 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 hover:bg-black hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}