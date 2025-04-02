"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle, XCircle, Clock, AlertCircle,
  Star, ChevronDown, Calendar, MapPin, Search,
  Bed, Car, Compass,
  Users,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { BookingStatus } from "@/components/auth";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Booking status types
type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";

// Service types
type ServiceType = "ACCOMMODATION" | "CAR_RENTAL" | "TOUR_GUIDE";

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ServiceType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useAuth();

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      // params.append('page', page.toString());
      // params.append('size', pageSize.toString());
      // params.append('sort', `${sortField},${sortDirection}`);

      // if (activeTab !== 'all') {
      // Map tab name to BookingStatus
      const statusMap: { [key: string]: BookingStatus | any } = {
        'pending': BookingStatus.PENDING,
        'confirmed': BookingStatus.CONFIRMED,
        'completed': BookingStatus.COMPLETED,
        'cancelled': `${BookingStatus.CANCELLED_BY_USER},${BookingStatus.CANCELLED_BY_PROVIDER}`,
        'noshow': BookingStatus.NO_SHOW
      };

      // Fetch bookings from provider endpoint
      const response = await api.get(`/bookings`, {
        params: {
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          serviceType: typeFilter !== "ALL" ? typeFilter : undefined,
          searchQuery: searchQuery || undefined,
        },
      });

      setBookings(response.data.content);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);


  const updateBookingStatus = async (bookingId: number, status: BookingStatus, reason?: string) => {
    setUpdateLoading(true);
    setCancelError(null);

    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {}, {
        params: {
          status,
          cancellationReason: reason
        }
      });

      // setBooking(response.data);
      setShowCancelDialog(false);
      setSuccessMessage(status === BookingStatus.CANCELLED_BY_USER
        ? "Your booking has been cancelled successfully."
        : "Booking status updated successfully.");

      // Close the cancel dialog if it was open
      if (showCancelDialog) {
        setShowCancelDialog(false);
      }
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      setCancelError(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: number) => {
    if (!cancellationReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    updateBookingStatus(bookingId, BookingStatus.CANCELLED_BY_USER, cancellationReason);
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
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

  const filteredBookings = bookings.filter((booking) => {
    let matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
    let matchesType = typeFilter === "ALL" || booking.serviceType === typeFilter;
    let matchesSearch = searchQuery === "" ||
      booking.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">View and manage your bookings</p>
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
                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "ALL")}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
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

          {/* <div>
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
                className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-600">No bookings found matching your filters.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative w-full md:w-48 h-48 md:h-auto">
                  <Image
                    src={booking?.service.thumbnailUrl}
                    alt={booking?.service?.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium flex items-center">
                    {getServiceIcon(booking.serviceType)}
                    <span className="ml-1">{getServiceTypeText(booking.serviceType)}</span>
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{booking?.service?.title}</h3>
                        <div className="ml-2">{getStatusText(booking.status)}</div>
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking?.service?.location.city}, {booking?.service?.location.country}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">${booking.totalPrice.toFixed(2)}</span>{" "}
                        <span className="text-gray-600 text-sm">total</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        Booking #{booking.id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Dates</div>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(booking.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {booking.startDateTime !== booking.endDateTime && (
                          <>
                            {" - "}
                            {new Date(booking.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Guests</div>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {booking?.guestCount} {booking?.guestCount === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                    {/* <div>
                      <div className="text-sm font-medium text-gray-500">Host</div>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <div className="relative h-4 w-4 rounded-full overflow-hidden mr-1">
                          <Image
                            src={booking.hostImage}
                            alt={booking.hostName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {booking.hostName}
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>

                    {booking.status === "COMPLETED" && booking.canReview && !booking.hasReviewed && (
                      <Link href={`/dashboard/reviews/create?booking=${booking.id}`}>
                        <Button className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Button>
                      </Link>
                    )}

                    {booking.status === "COMPLETED" && booking.hasReviewed && (
                      <Link href={`/dashboard/reviews`}>
                        <Button variant="outline" className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          View Your Review
                        </Button>
                      </Link>
                    )}

                    {booking.status === "PENDING" && (
                      <Button
                        onClick={() => setShowCancelDialog(true)}
                        variant="outline" className="text-red-600 hover:bg-red-50 hover:border-red-200">
                        Cancel Booking
                      </Button>
                    )}
                  </div>

                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>

                      {cancelError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <AlertDescription>{cancelError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="mt-4">
                        <label htmlFor="cancellation-reason" className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for cancellation *
                        </label>
                        <textarea
                          id="cancellation-reason"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          rows={3}
                          placeholder="Please tell us why you're cancelling..."
                          required
                        />
                      </div>

                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline" disabled={updateLoading}>
                            Keep Booking
                          </Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={updateLoading}
                        >
                          {updateLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Confirm Cancellation'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}