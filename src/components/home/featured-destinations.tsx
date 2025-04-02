import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

type Destination = {
  id: number;
  name: string;
  country: string;
  image: string;
  listingsCount: number;
  slug: string;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: "New York",
    country: "United States",
    image: "/images/destinations/new-york.avif",
    listingsCount: 355,
    slug: "new-york",
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    image: "/images/destinations/paris.avif",
    listingsCount: 280,
    slug: "paris",
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    image: "/images/destinations/tokyo.avif",
    listingsCount: 240,
    slug: "tokyo",
  },
  {
    id: 4,
    name: "London",
    country: "United Kingdom",
    image: "/images/destinations/london.avif",
    listingsCount: 312,
    slug: "london",
  },
  {
    id: 5,
    name: "Sydney",
    country: "Australia",
    image: "/images/destinations/sydney.avif",
    listingsCount: 198,
    slug: "sydney",
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after destinations with incredible experiences waiting for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/#`}
              className="group"
            >
              <div className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 group-hover:shadow-xl">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {destination.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">{destination.country}</p>
                    <span className="text-sm font-medium text-brand-600">
                      {destination.listingsCount} listings
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/#  "
            className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700"
          >
            View all destinations
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
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;