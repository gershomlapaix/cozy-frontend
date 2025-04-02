"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Loader2, ArrowLeft, Calendar, Users, MapPin, Star, Check, AlertCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { BookingStatus } from "@/components/auth";
// import { BookingStatus } from "@/components/auth/types";

interface BookingDetail {
  id: number;
  status: any;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  guestCount: number;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
  };
  service: {
    id: number;
    title: string;
    description: string;
    type: string;
    price: number;
    pricingUnit: string;
    thumbnailUrl?: string;
    address: string;
    location: {
      city: string;
      country: string;
    };
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      profileImageUrl?: string;
    };
  };
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if we have a success query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('success') === 'true') {
      setSuccessMessage("Booking confirmed successfully! You will receive an email with details shortly.");
    }
  }, []);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/bookings/${params.id}`);
      setBooking(response.data);
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      setError(error.response?.data?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

  const updateBookingStatus = async (status: BookingStatus, reason?: string) => {
    setUpdateLoading(true);
    setCancelError(null);

    try {
      const response = await api.patch(`/bookings/${params.id}/status`, {}, {
        params: {
          status,
          cancellationReason: reason
        }
      });

      setBooking(response.data);
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

  const handleCancelBooking = () => {
    if (!cancellationReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    updateBookingStatus(BookingStatus.CANCELLED_BY_USER, cancellationReason);
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.CANCELLED_BY_USER:
      case BookingStatus.CANCELLED_BY_PROVIDER:
        return "bg-red-100 text-red-800";
      case BookingStatus.NO_SHOW:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "Pending";
      case BookingStatus.CONFIRMED:
        return "Confirmed";
      case BookingStatus.COMPLETED:
        return "Completed";
      case BookingStatus.CANCELLED_BY_USER:
        return "Cancelled by you";
      case BookingStatus.CANCELLED_BY_PROVIDER:
        return "Cancelled by provider";
      case BookingStatus.NO_SHOW:
        return "No-show";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        <span className="ml-2 text-lg text-gray-700">Loading booking details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="text-lg font-medium">Error loading booking</h3>
          <p className="mt-2">{error}</p>
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

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
          <h3 className="text-lg font-medium">Booking not found</h3>
          <p className="mt-2">The booking you are looking for does not exist or you don't have permission to view it.</p>
          <Link href="/bookings">
            <Button className="mt-4">
              View all bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard/bookings" className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Bookings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 mr-2" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Booking Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-gray-500 text-sm">Booking Reference</p>
              <p className="font-medium text-lg">{`#${booking.id.toString().padStart(6, '0')}`}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Booked on</p>
                <p className="font-medium">
                  {format(parseISO(booking.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              {booking.cancelledAt && (
                <div>
                  <p className="text-sm text-gray-500">Cancelled on</p>
                  <p className="font-medium">
                    {format(parseISO(booking.cancelledAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}

              {(booking.status === BookingStatus.CANCELLED_BY_USER ||
                booking.status === BookingStatus.CANCELLED_BY_PROVIDER) &&
                booking.cancellationReason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Cancellation reason</p>
                    <p className="font-medium">{booking.cancellationReason}</p>
                  </div>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          {booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED ? (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>

              {booking.status === BookingStatus.PENDING && (
                <div className="flex items-center bg-yellow-50 rounded-md px-4 py-2 text-sm text-yellow-800">
                  <Clock className="h-4 w-4 mr-2" />
                  Waiting for confirmation from the host
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Accommodation and Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Service details */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={booking.service.thumbnailUrl || '/images/placeholder.jpg'}
                alt={booking.service.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{booking.service.title}</h2>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.service.location.city}, {booking.service.location.country}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">
                      {format(parseISO(booking.startDateTime), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-gray-600">
                      {format(parseISO(booking.startDateTime), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">
                      {format(parseISO(booking.endDateTime), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-gray-600">
                      {format(parseISO(booking.endDateTime), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-gray-600">
                      {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h3 className="font-medium mb-2">Special Requests</h3>
                  <p className="text-gray-600">{booking.specialRequests}</p>
                </div>
              )}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="font-medium mb-2">Host</h3>
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={booking.service.user.profileImageUrl || '/images/avatar.jpg'}
                      alt={`${booking.service.user.firstName} ${booking.service.user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {booking.service.user.firstName} {booking.service.user.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {booking.service.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Pricing details */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price</span>
                <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium">
                  {booking.status === BookingStatus.CONFIRMED ||
                    booking.status === BookingStatus.COMPLETED ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link href={`/accommodations/${booking.service.id}`}>
                <Button variant="outline" className="w-full mb-3">
                  View Service
                </Button>
              </Link>

              {(booking.status === BookingStatus.CONFIRMED ||
                booking.status === BookingStatus.COMPLETED) && (
                  <Button variant="outline" className="w-full">
                    Download Receipt
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Dialog */}
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
              onClick={handleCancelBooking}
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
  );
}