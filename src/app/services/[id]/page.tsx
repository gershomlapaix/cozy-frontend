"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, Calendar, Users, Check, X, ArrowLeft, Heart, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { addDays, differenceInDays, format, parseISO } from "date-fns";
import { PricingUnit, ServiceType } from "@/components/auth";

interface BookingFormData {
  startDateTime: string;
  endDateTime: string;
  guestCount: number;
  specialRequests: string;
  serviceId: number;
}

export default function AccommodationDetailPage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [accommodation, setAccommodation] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    nightsLabel: string;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
  }>({
    nightsLabel: "0 nights",
    subtotal: 0,
    cleaningFee: 75, // Example fixed fee
    serviceFee: 0,
    total: 0
  });

  // Fetch accommodation details
  const fetchAccommodation = async () => {
    setLoading(true);
    try {
      // In a real app, use the actual slug or ID from params
      const serviceId = params.id || 1;
      const response = await api.get(`/services/${serviceId}`);
      setAccommodation(response.data);

      // Initialize dates if empty
      if (!checkInDate) {
        const tomorrow = addDays(new Date(), 1);
        setCheckInDate(format(tomorrow, 'yyyy-MM-dd'));
      }

      if (!checkOutDate) {
        const dayAfterTomorrow = addDays(new Date(), 6);
        setCheckOutDate(format(dayAfterTomorrow, 'yyyy-MM-dd'));
      }

      // Calculate initial price breakdown
      calculatePriceBreakdown(response.data.price, response.data.pricingUnit);
    } catch (error: any) {
      console.error("Error fetching accommodation data:", error);
      setError(error.response?.data?.message || "Failed to load accommodation details");
    } finally {
      setLoading(false);
    }
  };

  // Calculate price breakdown based on selected dates and guest count
  const calculatePriceBreakdown = (price: number, pricingUnit: PricingUnit) => {
    if (!checkInDate || !checkOutDate || !price) return;

    let subtotal = 0;
    let nightsOrDaysLabel = "";

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    // Calculate nights (for display)
    const nights = differenceInDays(endDate, startDate);

    if (nights <= 0) {
      setError("Check-out date must be after check-in date");
      return;
    }

    // Calculate subtotal based on pricing unit
    switch (pricingUnit) {
      case PricingUnit.PER_NIGHT:
        subtotal = price * nights;
        nightsOrDaysLabel = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
        break;
      case PricingUnit.PER_DAY:
        subtotal = price * nights;
        nightsOrDaysLabel = `${nights} ${nights === 1 ? 'day' : 'days'}`;
        break;
      case PricingUnit.PER_PERSON:
        subtotal = price * guestCount;
        nightsOrDaysLabel = `${guestCount} ${guestCount === 1 ? 'person' : 'people'}`;
        break;
      case PricingUnit.PER_HOUR:
        // For hourly, we'd need time inputs, but for simplicity:
        subtotal = price * 24 * nights; // assuming 24 hours per day
        nightsOrDaysLabel = `${nights * 24} hours`;
        break;
      case PricingUnit.FIXED_PRICE:
        subtotal = price;
        nightsOrDaysLabel = "fixed price";
        break;
      default:
        subtotal = price * nights;
        nightsOrDaysLabel = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
    }

    // Calculate service fee (example: 10% of subtotal)
    const serviceFee = subtotal * 0.1;

    // Calculate total
    const total = subtotal + priceBreakdown.cleaningFee + serviceFee;

    setPriceBreakdown({
      nightsLabel: nightsOrDaysLabel,
      subtotal,
      cleaningFee: priceBreakdown.cleaningFee,
      serviceFee,
      total
    });
  };

  // Handle booking submission
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBookingLoading(true);

    // Validate dates
    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates");
      setBookingLoading(false);
      return;
    }

    // Convert dates to datetime format that backend expects
    const checkInDateTime = new Date(checkInDate);
    checkInDateTime.setHours(15, 0, 0); // Set check-in time to 3 PM

    const checkOutDateTime = new Date(checkOutDate);
    checkOutDateTime.setHours(11, 0, 0); // Set check-out time to 11 AM

    // Create booking request
    const bookingData: BookingFormData = {
      serviceId: accommodation.id,
      startDateTime: checkInDateTime.toISOString(),
      endDateTime: checkOutDateTime.toISOString(),
      guestCount: guestCount,
      specialRequests: specialRequests
    };

    try {
      // Make API call to create booking
      const response = await api.post('/bookings', bookingData);

      // Successful booking - redirect to bookings page
      router.push(`/bookings/${response.data.id}?success=true`);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      setError(error.response?.data?.message ||
        "Failed to create booking. Please try different dates or contact support.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Update price breakdown when dates or guest count changes
  useEffect(() => {
    if (accommodation && accommodation.price) {
      calculatePriceBreakdown(accommodation.price, accommodation.pricingUnit);
    }
  }, [checkInDate, checkOutDate, guestCount, accommodation]);

  // Initial data fetch
  useEffect(() => {
    fetchAccommodation();
  }, []);

  // Handle minimum check-out date
  const getMinCheckoutDate = () => {
    if (!checkInDate) return "";
    const checkIn = new Date(checkInDate);
    const nextDay = addDays(checkIn, 1);
    return format(nextDay, 'yyyy-MM-dd');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        <span className="ml-2 text-lg text-gray-700">Loading accommodation details...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Link href="/accommodations" className="text-gray-400 hover:text-gray-500">
                    Accommodations
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-700">{accommodation.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Title */}
        <div className="mb-6">
          <Link href="/accommodations" className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Accommodations
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{accommodation.title}</h1>
            <Button
              variant="outline"
              className={`mt-4 md:mt-0 ${isWishlisted ? 'bg-pink-50 text-pink-600 border-pink-200' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </Button>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400 mr-1">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <span className="font-medium text-gray-900">{accommodation.avgRating?.toFixed(1) || "New"}</span>
            <span className="text-gray-600 ml-1">({accommodation.reviewCount || 0} reviews)</span>
            <span className="mx-2">•</span>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {accommodation.location?.city}, {accommodation.location?.country}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 relative rounded-lg overflow-hidden h-80">
              {accommodation?.images?.length && (
                <Image
                  src={accommodation.images[selectedImage]}
                  alt={`${accommodation.title} - Featured Image`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4">
              {accommodation?.images?.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative rounded-lg overflow-hidden h-[170px]">
                  <Image
                    src={image}
                    alt={`${accommodation.title} - Gallery ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(index + 1)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="md:hidden flex mt-4 space-x-2 overflow-x-auto">
            {accommodation?.images?.map((image: string, index: number) => (
              <div
                key={index}
                className={`relative w-16 h-16 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-brand-500' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image src={image} alt={`Thumbnail ${index}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={accommodation.user?.profileImageUrl || "/images/avatar.jpg"}
                    alt={accommodation.user?.firstName || "Host"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">Hosted by</p>
                  <h3 className="text-lg font-medium text-gray-900">
                    {accommodation.user?.firstName || ""} {accommodation.user?.lastName || ""}
                  </h3>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>
              <div className="prose max-w-none text-gray-600">
                {accommodation?.description?.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Capacity & Details */}
            {accommodation.capacity && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-brand-600 mb-2" />
                    <span className="font-medium">{accommodation.capacity}</span>
                    <span className="text-sm text-gray-500">Guests</span>
                  </div>
                  {accommodation.type === ServiceType.ACCOMMODATION && (
                    <>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Check className="h-6 w-6 text-brand-600 mb-2" />
                        <span className="font-medium">3:00 PM</span>
                        <span className="text-sm text-gray-500">Check-in</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Check className="h-6 w-6 text-brand-600 mb-2" />
                        <span className="font-medium">11:00 AM</span>
                        <span className="text-sm text-gray-500">Check-out</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {accommodation?.amenities?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accommodation.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-600 mb-4">{accommodation.address}</p>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {(accommodation.latitude && accommodation.longitude) &&
                  (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.507889685052!2d30.091482776745864!3d-1.9997790385511908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca936c4300be3%3A0x802344ff32fb74d7!2sKonvine%20Boutique%20Hotel!5e0!3m2!1sen!2sus!4v1716467123446!5m2!1sen!2sus"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      loading="lazy">
                    </iframe>)
                  // (
                  //   <iframe
                  //     src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${accommodation.latitude},${accommodation.longitude}`}
                  //     className="w-full h-full rounded-lg"
                  //     allowFullScreen
                  //     loading="lazy">
                  //   </iframe>
                  // ) : (
                  //   <iframe
                  //     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.507889685052!2d30.091482776745864!3d-1.9997790385511908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca936c4300be3%3A0x802344ff32fb74d7!2sKonvine%20Boutique%20Hotel!5e0!3m2!1sen!2sus!4v1716467123446!5m2!1sen!2sus"
                  //     className="w-full h-full rounded-lg"
                  //     allowFullScreen
                  //     loading="lazy">
                  //   </iframe>)
                }
              </div>
            </div>

            {/* Policies */}
            {accommodation?.policies?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
                <div className="space-y-3">
                  {accommodation.policies.map((policy: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1">
                        {policy.toLowerCase().startsWith("no") ? (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        ) : (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        )}
                      </div>
                      <span className="text-gray-600">{policy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${accommodation.price?.toFixed(2)}</span>
                  <span className="text-gray-600">
                    {accommodation.pricingUnit === PricingUnit.PER_NIGHT && " / night"}
                    {accommodation.pricingUnit === PricingUnit.PER_DAY && " / day"}
                    {accommodation.pricingUnit === PricingUnit.PER_HOUR && " / hour"}
                    {accommodation.pricingUnit === PricingUnit.PER_PERSON && " / person"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{accommodation.avgRating?.toFixed(1) || "New"}</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="check-in"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                    <Calendar className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="check-out"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={getMinCheckoutDate()}
                      required
                    />
                    <Calendar className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <select
                      id="guests"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    >
                      {[...Array(accommodation.capacity || 6)].map((_, i) => {
                        const num = i + 1;
                        return (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "guest" : "guests"}
                          </option>
                        );
                      })}
                    </select>
                    <Users className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="special-requests"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    placeholder="Any special requirements or requests?"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={bookingLoading}>
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Book now"
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    ${accommodation.price?.toFixed(2)} x {priceBreakdown.nightsLabel}
                  </span>
                  <span className="text-gray-900">${priceBreakdown.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="text-gray-900">${priceBreakdown.cleaningFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">${priceBreakdown.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${priceBreakdown.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}