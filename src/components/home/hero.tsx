"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Bed, Car, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"accommodations" | "cars" | "tours">("accommodations");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // router.push(`/${searchType}?q=${encodeURIComponent(searchQuery)}`);
      router.push(`/services`);
    }
  };

  return (
    <div className="relative h-[600px] w-full">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Travel destination"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Discover Your Perfect <span className="text-brand-400">Local Experience</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
          Find the best accommodations, car rentals, and guided tours from trusted local businesses.
        </p>

        {/* Search Form */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-1">
          <div className="flex flex-wrap">
            {/* Search Type Tabs */}
            <div className="w-full md:w-auto flex mb-2 md:mb-0 rounded-t-lg md:rounded-l-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setSearchType("accommodations")}
                className={`flex items-center py-3 px-4 ${
                  searchType === "accommodations"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <Bed className="h-5 w-5 mr-2" />
                <span>Stay</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType("cars")}
                className={`flex items-center py-3 px-4 ${
                  searchType === "cars"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <Car className="h-5 w-5 mr-2" />
                <span>Cars</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType("tours")}
                className={`flex items-center py-3 px-4 ${
                  searchType === "tours"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <Compass className="h-5 w-5 mr-2" />
                <span>Tours</span>
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center p-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === "accommodations"
                      ? "Where are you going?"
                      : searchType === "cars"
                      ? "Find a car rental"
                      : "Search for tours and activities"
                  }
                  className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
              <Button type="submit" className="ml-4">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-black">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="font-semibold">1,000+</span> Local Accommodations
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="font-semibold">500+</span> Car Rental Options
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="font-semibold">300+</span> Guided Tours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;