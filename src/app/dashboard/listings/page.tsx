"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Edit, Trash, CheckCircle,
  XCircle, Search, ChevronDown, Bed, Car, Compass,
  Star, Calendar, MapPin, PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

// Service types
type ServiceType = "ACCOMMODATION" | "CAR_RENTAL" | "TOUR_GUIDE";

// Service status
type ServiceStatus = "ACTIVE" | "PENDING" | "INACTIVE";

// Mock listing data
interface Listing {
  id: string;
  type: ServiceType;
  title: string;
  image: string;
  location: string;
  price: number;
  pricingUnit: string;
  status: ServiceStatus;
  isVerified: boolean;
  bookingsCount: number;
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  slug: string;
}

export default function ListingsPage() {
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ServiceType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  console.log(user);


  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Eye className="h-5 w-5 text-yellow-500" />;
      case "INACTIVE":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const fetchMyListings = async () => {
    try {
      const response = await api.get(`/services/provider/${user?.id}`);
      const data = await response.data;

      console.log("Fetched Listings:", data.content);

      setListings(data.content);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending Verification
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case "ACCOMMODATION":
        return <Bed className="h-4 w-4" />;
      case "CAR_RENTAL":
        return <Car className="h-4 w-4" />;
      case "TOUR_GUIDE":
        return <Compass className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getServiceTypeText = (type: ServiceType) => {
    switch (type) {
      case "ACCOMMODATION":
        return "Accommodation";
      case "CAR_RENTAL":
        return "Car Rental";
      case "TOUR_GUIDE":
        return "Tour";
      default:
        return "Service";
    }
  };

  const filteredListings = listings.filter((listing) => {
    let matchesStatus = statusFilter === "ALL" || listing.status === statusFilter;
    let matchesType = typeFilter === "ALL" || listing.type === typeFilter;
    let matchesSearch = searchQuery === "" ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600">Manage your services and listings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/listings/create">
            {/* <Button className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Listing
            </Button> */}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | "ALL")}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending Verification</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <div className="relative">
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ServiceType | "ALL")}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              >
                <option value="ALL">All Types</option>
                <option value="ACCOMMODATION">Accommodations</option>
                <option value="CAR_RENTAL">Car Rentals</option>
                <option value="TOUR_GUIDE">Tours</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2 sm:text-sm border-gray-400 rounded-md"
                placeholder="Search by name or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-6">
        {filteredListings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-600">No listings found matching your filters.</p>
            <Link href="/dashboard/listings/create" className="mt-4 inline-block">
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Listing
              </Button>
            </Link>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative w-full md:w-48 h-48 md:h-auto">
                  <Image
                    src={listing.thumbnailUrl}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium flex items-center">
                    {getServiceIcon(listing.type)}
                    <span className="ml-1">{getServiceTypeText(listing.type)}</span>
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                        <div className="ml-2">{getStatusText(listing.status)}</div>
                        {listing.isVerified && (
                          <div className="ml-2 flex items-center text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location.city} {listing.location.country && `, ${listing.location.country}`}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">${listing.price.toFixed(2)}</span>{" "}
                        <span className="text-gray-600 text-sm">{listing.pricingUnit}</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        ID: {listing.id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <div>
                      {/* <div className="text-sm font-medium text-gray-500">Bookings</div>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {listing.bookingsCount}
                      </div> */}
                    </div>
                    {listing.rating && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Rating</div>
                        <div className="mt-1 flex items-center text-sm text-gray-900">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {listing.rating} ({listing.reviewCount} reviews)
                        </div>
                      </div>
                    )}
                    {/* <div>
                      <div className="text-sm font-medium text-gray-500">Created</div>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(listing?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    <Link href={`/services/${listing.id}`}
                      // ${listing.type === 'ACCOMMODATION' ? 'accommodations' :
                      //     listing.type === 'CAR_RENTAL' ? 'car-rentals' : 'tours'}/${listing.id}`}
                      target="_blank">
                      <Button variant="outline" className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Listing
                      </Button>
                    </Link>

                    <Link href={`/dashboard/availability/${listing.id}`}>
                      <Button variant="outline" className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Availability managment
                      </Button>
                    </Link>

                    {/* <Link href={`/dashboard/listings/edit/${listing.id}`}>
                      <Button variant="outline" className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    {listing.status !== "ACTIVE" && (
                      <Button variant="outline" className="flex items-center text-green-600 hover:bg-green-50 hover:border-green-200">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </Button>
                    )}

                    {listing.status !== "INACTIVE" && (
                      <Button variant="outline" className="flex items-center text-red-600 hover:bg-red-50 hover:border-red-200">
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </Button>
                    )}

                    <Button variant="outline" className="flex items-center text-red-600 hover:bg-red-50 hover:border-red-200">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}