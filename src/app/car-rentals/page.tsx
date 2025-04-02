import Image from "next/image";
import Link from "next/link";
import { Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for car rentals
const carRentals = [
  {
    id: 1,
    title: "Premium Car Rental in Tokyo",
    location: "Tokyo, Japan",
    price: 75,
    rating: 4.2,
    reviewCount: 12,
    image: "/images/services/car-tokyo.jpg",
    description: "Explore Tokyo and beyond with our premium car rental service. Choose from economy, luxury, or hybrid vehicles for your journey.",
    features: ["GPS Navigation", "Child Seats Available", "24/7 Support", "Insurance Included", "Unlimited Mileage"],
    slug: "premium-car-rental-tokyo",
  },
  {
    id: 2,
    title: "Luxury SUV Rental",
    location: "New York, United States",
    price: 120,
    rating: 4.7,
    reviewCount: 28,
    image: "/images/services/car-suv.jpg",
    description: "Travel in style and comfort with our luxury SUV rentals. Perfect for families or groups exploring the city and surrounding areas.",
    features: ["Leather Seats", "GPS Navigation", "Bluetooth Connectivity", "Backup Camera", "All-Wheel Drive"],
    slug: "luxury-suv-rental-nyc",
  },
  {
    id: 3,
    title: "Convertible Car Experience",
    location: "Los Angeles, United States",
    price: 95,
    rating: 4.5,
    reviewCount: 18,
    image: "/images/services/car-convertible.jpg",
    description: "Feel the breeze in your hair as you cruise down the coast in one of our premium convertibles. The perfect LA experience!",
    features: ["Convertible Top", "Premium Sound System", "Leather Seats", "GPS Navigation", "Cruise Control"],
    slug: "convertible-car-experience-la",
  },
  {
    id: 4,
    title: "Eco-Friendly Hybrid Rental",
    location: "Vancouver, Canada",
    price: 65,
    rating: 4.6,
    reviewCount: 32,
    image: "/images/services/car-hybrid.jpg",
    description: "Reduce your carbon footprint while exploring Vancouver with our fleet of modern, fuel-efficient hybrid vehicles.",
    features: ["Hybrid Engine", "Excellent Fuel Economy", "GPS Navigation", "Bluetooth Connectivity", "Backup Camera"],
    slug: "eco-friendly-hybrid-vancouver",
  },
  {
    id: 5,
    title: "Luxury Sports Car Rental",
    location: "Miami, United States",
    price: 250,
    rating: 4.8,
    reviewCount: 15,
    image: "/images/services/car-sports.jpg",
    description: "Make a statement with our high-performance sports cars. Turn heads as you cruise down Miami Beach in style.",
    features: ["High Performance Engine", "Premium Sound System", "Leather Seats", "Convertible Option", "Sport Mode"],
    slug: "luxury-sports-car-miami",
  },
  {
    id: 6,
    title: "Family Van Rental",
    location: "Orlando, United States",
    price: 110,
    rating: 4.4,
    reviewCount: 22,
    image: "/images/services/car-van.jpg",
    description: "Spacious and comfortable vans perfect for family trips to theme parks and attractions around Orlando.",
    features: ["Seats 7-8 People", "Ample Luggage Space", "Child Seats Available", "Entertainment System", "Cruise Control"],
    slug: "family-van-rental-orlando",
  },
];

export default function CarRentalsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Car Rentals</h1>
              <p className="mt-2 text-brand-100">
                Explore with freedom and flexibility by renting a car from local providers
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-brand-100">Showing {carRentals.length} results</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="">All types</option>
                <option value="economy">Economy</option>
                <option value="compact">Compact</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="convertible">Convertible</option>
                <option value="van">Van/Minivan</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="">Price range</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-150">$100 - $150</option>
                <option value="150+">$150+</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="">Guest rating</option>
                <option value="4.5+">4.5 & up</option>
                <option value="4+">4.0 & up</option>
                <option value="3.5+">3.5 & up</option>
                <option value="3+">3.0 & up</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Car Rentals List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carRentals.map((carRental) => (
            <Link key={carRental.id} href={`/car-rentals/${carRental.slug}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={carRental.image}
                    alt={carRental.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    Car Rental
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-1">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{carRental.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({carRental.reviewCount} reviews)</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {carRental.title}
                  </h3>
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500 ml-1 line-clamp-1">{carRental.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-auto line-clamp-3">
                    {carRental.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {carRental.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {carRental.features.length > 3 && (
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                        +{carRental.features.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-brand-600">${carRental.price}</span>{" "}
                      <span className="text-sm text-gray-500">per day</span>
                    </div>
                    <Button variant="ghost" className="text-brand-600 group-hover:bg-brand-50">
                      View details
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-brand-50 text-sm font-medium text-brand-600"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}