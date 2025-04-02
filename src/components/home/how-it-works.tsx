import Image from "next/image";
import { Search, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-10 w-10 text-brand-600" />,
    title: "Find What You Need",
    description: "Browse through our wide selection of accommodations, car rentals, and guided tours from trusted local providers.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-brand-600" />,
    title: "Book With Confidence",
    description: "Secure your reservation with our easy booking system. Flexible cancellation options available for peace of mind.",
  },
  {
    icon: <Star className="h-10 w-10 text-brand-600" />,
    title: "Enjoy Your Experience",
    description: "Experience the best local hospitality and services. Share your feedback to help other travelers and our partners.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How CozyStay Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We connect travelers with local businesses to create memorable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105"
            >
              <div className="p-4 bg-brand-50 rounded-full mb-6">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-50 rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 py-12 px-6 md:px-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Become a CozyStay Partner
              </h3>
              <p className="text-gray-600 mb-6">
                Are you a local business owner in the tourism and hospitality sector? Join our platform to showcase your services to travelers from around the world. Expand your reach and grow your business with CozyStay.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Showcase your services to a global audience</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Simple booking management system</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Dedicated support for partners</span>
                </li>
              </ul>
              <a
                href="/partner"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Learn More About Partnering
              </a>
            </div>
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
              <Image
                src="/images/partner-image.jpg"
                alt="CozyStay Partner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;