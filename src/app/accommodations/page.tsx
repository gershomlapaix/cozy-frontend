// app/accommodations/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, MapPin, Star, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccommodations } from "@/hooks/useAccommodations";
import { useCategories } from "@/hooks/useCategories";
import { Service } from "@/components/auth";
import { useLocations } from "@/hooks/useLocations";

export default function AccommodationsPage() {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    accommodations,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    setPage,
    filters,
    updateFilters
  } = useAccommodations();
  
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { locations, isLoading: locationsLoading } = useLocations();  
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchTerm: e.target.value });
  };
  
  const handlePriceFilterChange = (min?: number, max?: number) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ category: e.target.value || undefined });
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ location: e.target.value || undefined });
  };
  
  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rating = e.target.value ? Number(e.target.value) : undefined;
    updateFilters({ rating });
  };
  
  const handleClearFilters = () => {
    updateFilters({
      minPrice: undefined,
      maxPrice: undefined,
      category: undefined,
      location: undefined,
      rating: undefined,
      searchTerm: undefined
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 0
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="text-lg font-medium">Error loading accommodations</h3>
          <p className="mt-2">{error.message || "Please try again later."}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Accommodations</h1>
              <p className="mt-2 text-brand-100">
                Find and book the perfect place to stay from our trusted local partners
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-brand-100">
                Showing {totalElements} {totalElements === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Search accommodations..."
                value={filters.searchTerm || ''}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Filter Toggle Button (Mobile) */}
            <div className="md:hidden">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden md:flex md:items-center space-x-4">
              {/* Category Filter */}
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={filters.category || ''}
                onChange={handleCategoryChange}
                disabled={categoriesLoading}
              >
                <option value="">All types</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Location Filter */}
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={filters.location || ''}
                onChange={handleLocationChange}
                disabled={locationsLoading}
              >
                <option value="">All locations</option>
                {locations?.map(location => (
                  <option key={location.id} value={location.id.toString()}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
              
              {/* Price Range Filter */}
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={
                  filters.minPrice !== undefined && filters.maxPrice !== undefined
                    ? `${filters.minPrice}-${filters.maxPrice}`
                    : ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) {
                    handlePriceFilterChange(undefined, undefined);
                  } else {
                    const [min, max] = value.split('-').map(Number);
                    handlePriceFilterChange(min, max);
                  }
                }}
              >
                <option value="">Any price</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="500-1000">$500+</option>
              </select>
              
              {/* Rating Filter */}
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={filters.rating || ''}
                onChange={handleRatingChange}
              >
                <option value="">Any rating</option>
                <option value="4.5">4.5 & up</option>
                <option value="4">4.0 & up</option>
                <option value="3.5">3.5 & up</option>
                <option value="3">3.0 & up</option>
              </select>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile Filters (Expandable) */}
          {showFilters && (
            <div className="md:hidden mt-4 space-y-4 pb-2 border-b border-gray-200">
              {/* Mobile Category Filter */}
              <div>
                <label htmlFor="mobile-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="mobile-category"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                  value={filters.category || ''}
                  onChange={handleCategoryChange}
                  disabled={categoriesLoading}
                >
                  <option value="">All types</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Mobile Location Filter */}
              <div>
                <label htmlFor="mobile-location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="mobile-location"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                  value={filters.location || ''}
                  onChange={handleLocationChange}
                  disabled={locationsLoading}
                >
                  <option value="">All locations</option>
                  {locations?.map(location => (
                    <option key={location.id} value={location.id.toString()}>
                      {location.city}, {location.country}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Mobile Price Range Filter */}
              <div>
                <label htmlFor="mobile-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price range
                </label>
                <select
                  id="mobile-price"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                  value={
                    filters.minPrice !== undefined && filters.maxPrice !== undefined
                      ? `${filters.minPrice}-${filters.maxPrice}`
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      handlePriceFilterChange(undefined, undefined);
                    } else {
                      const [min, max] = value.split('-').map(Number);
                      handlePriceFilterChange(min, max);
                    }
                  }}
                >
                  <option value="">Any price</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200-300">$200 - $300</option>
                  <option value="300-500">$300 - $500</option>
                  <option value="500-1000">$500+</option>
                </select>
              </div>
              
              {/* Mobile Rating Filter */}
              <div>
                <label htmlFor="mobile-rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  id="mobile-rating"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                  value={filters.rating || ''}
                  onChange={handleRatingChange}
                >
                  <option value="">Any rating</option>
                  <option value="4.5">4.5 & up</option>
                  <option value="4">4.0 & up</option>
                  <option value="3.5">3.5 & up</option>
                  <option value="3">3.0 & up</option>
                </select>
              </div>
              
              {/* Clear Filters (Mobile) */}
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="w-full flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Accommodations List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {accommodations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accommodations found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                    page === i
                      ? 'bg-brand-50 text-brand-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

// Accommodation Card Component
interface AccommodationCardProps {
  accommodation: Service;
}

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
    console.log(accommodation);
    
  return (
    <Link href={`/accommodations/${accommodation.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={accommodation?.thumbnailUrl || '/images/placeholder.jpg'}
            alt={accommodation.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium flex items-center">
            <Bed className="h-3 w-3 mr-1" />
            Accommodation
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400 mr-1">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span className="text-sm font-medium text-gray-900">{accommodation.avgRating?.toFixed(1) || "New"}</span>
            {accommodation.reviewCount && accommodation.reviewCount > 0 && (
              <span className="text-sm text-gray-500 ml-1">({accommodation.reviewCount} reviews)</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {accommodation.title}
          </h3>
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-500 ml-1 line-clamp-1">
              {accommodation.location.city}, {accommodation.location.country}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-4 mt-auto border-t border-gray-100">
            <div>
              <span className="text-lg font-bold text-brand-600">${accommodation.price.toFixed(2)}</span>{" "}
              <span className="text-sm text-gray-500">
                {accommodation.pricingUnit === 'PER_NIGHT' ? 'per night' : 
                 accommodation.pricingUnit === 'PER_DAY' ? 'per day' : 
                 accommodation.pricingUnit === 'PER_PERSON' ? 'per person' : ''}
              </span>
            </div>
            <Button variant="ghost" className="text-brand-600 group-hover:bg-brand-50">
              View details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};