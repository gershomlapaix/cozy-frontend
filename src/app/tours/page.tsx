import Image from "next/image";
import Link from "next/link";
import { Compass, MapPin, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for tours
const tours = [
  {
    id: 1,
    title: "Historical London Walking Tour",
    location: "London, United Kingdom",
    price: 35,
    rating: 4.9,
    reviewCount: 32,
    image: "/images/services/tour-london.jpg",
    description: "Discover London's rich history with our expert guide. Visit iconic landmarks, hidden gems, and hear fascinating stories about the city's past.",
    duration: "3 hours",
    groupSize: "Max 15 people",
    highlights: ["Tower of London", "Buckingham Palace", "Westminster Abbey", "Hidden Alleys", "Local Insights"],
    slug: "historical-london-walking-tour",
  },
  {
    id: 2,
    title: "Paris Food & Wine Experience",
    location: "Paris, France",
    price: 85,
    rating: 4.8,
    reviewCount: 46,
    image: "/images/services/tour-paris-food.jpg",
    description: "Indulge in authentic French cuisine and wine on this guided culinary adventure through the streets of Paris.",
    duration: "4 hours",
    groupSize: "Max 8 people",
    highlights: ["Cheese Tasting", "Wine Pairings", "Pastry Shops", "Local Restaurants", "Market Visit"],
    slug: "paris-food-wine-experience",
  },
  {
    id: 3,
    title: "Tokyo Cultural Immersion",
    location: "Tokyo, Japan",
    price: 60,
    rating: 4.7,
    reviewCount: 27,
    image: "/images/services/tour-tokyo.jpg",
    description: "Experience traditional and modern Japanese culture with a local guide. From ancient temples to modern pop culture.",
    duration: "5 hours",
    groupSize: "Max 10 people",
    highlights: ["Tea Ceremony", "Shrine Visit", "Harajuku District", "Traditional Arts", "Local Customs"],
    slug: "tokyo-cultural-immersion",
  },
  {
    id: 4,
    title: "New York City by Night",
    location: "New York, United States",
    price: 50,
    rating: 4.6,
    reviewCount: 38,
    image: "/images/services/tour-nyc-night.jpg",
    description: "See the city that never sleeps come alive after dark. Stunning skyline views, vibrant neighborhoods, and iconic landmarks.",
    duration: "3 hours",
    groupSize: "Max 12 people",
    highlights: ["Times Square", "Brooklyn Bridge", "Empire State Building", "High Line", "Hidden Speakeasies"],
    slug: "new-york-city-by-night",
  },
  {
    id: 5,
    title: "Rome Ancient History Tour",
    location: "Rome, Italy",
    price: 55,
    rating: 4.8,
    reviewCount: 51,
    image: "/images/services/tour-rome.jpg",
    description: "Journey through ancient Rome with an expert historian guide. Discover the stories behind the city's most iconic ruins.",
    duration: "4 hours",
    groupSize: "Max 15 people",
    highlights: ["Colosseum", "Roman Forum", "Palatine Hill", "Ancient Architecture", "Historical Stories"],
    slug: "rome-ancient-history-tour",
  },
  {
    id: 6,
    title: "Barcelona Gaudi Architecture Tour",
    location: "Barcelona, Spain",
    price: 45,
    rating: 4.7,
    reviewCount: 42,
    image: "/images/services/tour-barcelona.jpg",
    description: "Explore the fantastical works of Antoni Gaudi that define Barcelona's unique architectural character.",
    duration: "3.5 hours",
    groupSize: "Max 10 people",
    highlights: ["Sagrada Familia", "Park Güell", "Casa Batlló", "Casa Milà", "Architectural Context"],
    slug: "barcelona-gaudi-architecture-tour",
  },
];

export default function ToursPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Tours & Activities</h1>
              <p className="mt-2 text-brand-100">
                Discover local experiences guided by knowledgeable experts
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-brand-100">Showing {tours.length} results</p>
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
                <option value="walking">Walking Tours</option>
                <option value="food">Food & Drink</option>
                <option value="history">History & Culture</option>
                <option value="adventure">Adventure</option>
                <option value="night">Night Tours</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="">Duration</option>
                <option value="0-2">Less than 2 hours</option>
                <option value="2-4">2-4 hours</option>
                <option value="4-8">4-8 hours</option>
                <option value="8+">Full day+</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="">Price range</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="duration-short">Duration: Shortest</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tours List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link key={tour.id} href={`/tours/${tour.slug}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full py-1 px-3 text-xs font-medium flex items-center">
                    <Compass className="h-3 w-3 mr-1" />
                    Tour
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-1">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({tour.reviewCount} reviews)</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tour.title}
                  </h3>
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500 ml-1 line-clamp-1">{tour.location}</span>
                  </div>
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      {tour.groupSize}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-auto line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 3 && (
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                        +{tour.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-brand-600">${tour.price}</span>{" "}
                      <span className="text-sm text-gray-500">per person</span>
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