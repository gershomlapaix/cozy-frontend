import Hero from "@/components/home/hero";
import FeaturedDestinations from "@/components/home/featured-destinations";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeaturedServices from "@/components/home/featured-services";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Featured Services */}
      <FeaturedServices />

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* How It Works */}
      {/* <HowItWorks /> */}

      {/* Testimonials */}
      {/* <Testimonials /> */}

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-600 rounded-2xl py-12 px-6 md:py-16 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Stay Updated with Travel Inspiration
              </h2>
              <p className="text-brand-100 mb-8">
                Subscribe to our newsletter for exclusive deals, travel tips, and new destination highlights.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none"
                  required
                />
                <Button className="bg-white text-brand-600 hover:bg-brand-50">
                  Subscribe
                </Button>
              </form>
              <p className="text-brand-100 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Discover Your Perfect Local Experience?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Start planning your next adventure with CozyStay's curated selection of accommodations, car rentals, and guided tours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/accommodations">
                <Button size="lg" className="min-w-[180px]">
                  Find Accommodation
                </Button>
              </Link>
              {/* <Link href="/services">
                <Button variant="outline" size="lg" className="min-w-[180px]">
                  Browse All Services
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}