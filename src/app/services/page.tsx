"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { PricingUnit, ServiceType } from "@/components/auth";

interface ServiceResponse {
  id: number;
  title: string;
  description: string;
  type: ServiceType;
  price: number;
  pricingUnit: PricingUnit;
  thumbnailUrl: string;
  isActive: boolean;
  isVerified: boolean;
  avgRating: number;
  reviewCount: number;
  category: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    city: string;
    country: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

const FeaturedServices = () => {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        // Fetch top rated services
        const response = await api.get('/services/top-rated?size=20');
        setServices(response.data.content);
      } catch (err: any) {
        console.error("Error fetching featured services:", err);
        setError(err.response?.data?.message || "Failed to load featured services");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const getServiceLink = (service: ServiceResponse) => {
    switch (service.type) {
      case ServiceType.ACCOMMODATION:
        return `/services/${service.id}`;
      case ServiceType.TRANSPORTATION:
        return `/services/${service.id}`;
      case ServiceType.TOUR_GUIDE:
        return `/services/${service.id}`;
      case ServiceType.FOOD_EXPERIENCE:
        return `/#`;
      case ServiceType.LOCAL_EVENT:
        return `/#`;
      case ServiceType.CAR_RENTAL:
        return `/services/${service.id}`;
      case ServiceType.ACTIVITY:
        return `/#`;
      default:
        return `/#`;
    }
  };

  const getServiceTypeText = (type: ServiceType) => {
    switch (type) {
      case ServiceType.ACCOMMODATION:
        return "Accommodation";
      case ServiceType.TRANSPORTATION:
        return "Transportation";
      case ServiceType.TOUR_GUIDE:
        return "Tour";
      case ServiceType.FOOD_EXPERIENCE:
        return "Food";
      case ServiceType.CAR_RENTAL:
        return "Car Rental";
      case ServiceType.LOCAL_EVENT:
        return "Event";
      case ServiceType.ACTIVITY:
        return "Activity";
      default:
        return "Service";
    }
  };

  const getPriceLabel = (pricingUnit: PricingUnit) => {
    switch (pricingUnit) {
      case PricingUnit.PER_NIGHT:
        return "per night";
      case PricingUnit.PER_DAY:
        return "per day";
      case PricingUnit.PER_HOUR:
        return "per hour";
      case PricingUnit.PER_PERSON:
        return "per person";
      case PricingUnit.FIXED_PRICE:
        return "fixed price";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Discover Experiences</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top-rated accommodations, transportation, and guided tours from our local partners
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Experiences</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top-rated accommodations, transportation, and guided tours from our local partners
            </p>
          </div>
          <Alert className="max-w-3xl mx-auto" variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Experiences</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated accommodations, transportation, and guided tours from our local partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={getServiceLink(service)} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.thumbnailUrl || '/images/placeholder.jpg'}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium">
                    {getServiceTypeText(service.type)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-1">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{service.avgRating?.toFixed(1) || "New"}</span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({service.reviewCount || 0} {service.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <div className="flex items-start mb-auto">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500 ml-1 line-clamp-1">
                      {service.location.city}, {service.location.country}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-brand-600">${service.price.toFixed(2)}</span>{" "}
                      <span className="text-sm text-gray-500">{getPriceLabel(service.pricingUnit)}</span>
                    </div>
                    <span className="text-sm font-medium text-brand-600 group-hover:underline">
                      {/* View details */}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700"
          >
            View all services
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedServices;