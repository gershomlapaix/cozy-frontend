import Image from "next/image";
import { Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  serviceType: "accommodation" | "car" | "tour";
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Toronto, Canada",
    avatar: "/images/testimonials/avatar1.jpg",
    rating: 5,
    comment: "The apartment we booked through CozyStay exceeded our expectations. It was clean, beautifully furnished, and in a perfect location. The local host was incredibly helpful and gave us great recommendations for restaurants in the area.",
    serviceType: "accommodation",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, USA",
    avatar: "/images/testimonials/avatar2.jpg",
    rating: 5,
    comment: "Renting a car through CozyStay made our trip so much easier. The process was seamless, and the vehicle was in excellent condition. We were able to explore at our own pace and discover hidden gems off the usual tourist path.",
    serviceType: "car",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "London, UK",
    avatar: "/images/testimonials/avatar3.jpg",
    rating: 5,
    comment: "Our guided tour was the highlight of our vacation! Our guide was knowledgeable, passionate, and showed us places we would never have found on our own. It was so nice supporting a local business rather than a big corporate tour company.",
    serviceType: "tour",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who have experienced our local services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
              
              <div className="flex items-center text-sm text-brand-600">
                <span className="capitalize">
                  {testimonial.serviceType === "accommodation"
                    ? "Accommodation"
                    : testimonial.serviceType === "car"
                    ? "Car Rental"
                    : "Guided Tour"}
                </span>
                <span className="mx-2">•</span>
                <span>Verified Stay</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="/testimonials"
            className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700"
          >
            View more testimonials
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
          </a>
        </div>
      </div>
    </section>
    );
}

export default Testimonials;