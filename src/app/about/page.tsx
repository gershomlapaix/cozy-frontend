import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Users, Globe, Award, Heart, Search } from "lucide-react";

const stats = [
  { value: "1,000+", label: "Local Businesses", icon: Home },
  { value: "50,000+", label: "Happy Travelers", icon: Users },
  { value: "100+", label: "Destinations", icon: Globe },
  { value: "4.8/5", label: "Average Rating", icon: Award },
];

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/images/team/team1.jpg",
    bio: "Sarah founded CozyStay with a vision to empower local businesses in the tourism industry and provide authentic experiences to travelers."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/images/team/team2.jpg",
    bio: "Michael leads our technology team, ensuring that our platform is secure, reliable, and continuously improving to meet the needs of our users."
  },
  {
    name: "Emma Rodriguez",
    role: "Head of Operations",
    image: "/images/team/team3.jpg",
    bio: "Emma oversees our day-to-day operations, working closely with both providers and travelers to ensure exceptional experiences."
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    image: "/images/team/team4.jpg",
    bio: "David drives our marketing strategy, helping both travelers discover unique experiences and local businesses reach their target audience."
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-brand-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/about-hero.jpg"
            alt="About CozyStay"
            fill
            className="object-cover object-center opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">About CozyStay</h1>
            <p className="mt-6 text-xl leading-8 text-brand-100">
              Connecting travelers with authentic local experiences and empowering small businesses in the tourism industry.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              At CozyStay, we believe that travel should be about authentic connections and supporting local communities. Our mission is to empower small businesses in the tourism and hospitality sector by giving them a platform to showcase their unique offerings to travelers from around the world.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              We're dedicated to creating a community where travelers can discover and book accommodations, car rentals, and guided tours from trusted local providers, ensuring that tourism benefits the local economy and preserves the cultural heritage of destinations.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="/images/about-mission.jpg"
                alt="Our mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-brand-100 p-3">
                    <stat.icon className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-base text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Story</h2>
          <p className="mt-4 text-lg text-gray-600">
            CozyStay began with a simple observation: while traveling, the most memorable experiences often come from interactions with locals and small businesses that offer authentic, personalized services.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center">
              <div className="rounded-full bg-brand-100 p-3">
                <Heart className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center">The Beginning</h3>
            <p className="mt-2 text-gray-600">
              Founded in 2020, CozyStay was born from our founder's frustration with finding authentic local accommodations and experiences while traveling. We started with a small team and a big vision: to create a platform that connects travelers directly with local providers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center">
              <div className="rounded-full bg-brand-100 p-3">
                <Search className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center">Growth & Discovery</h3>
            <p className="mt-2 text-gray-600">
              As we grew, we discovered the immense value in supporting local tourism businesses. We expanded beyond accommodations to include car rentals, guided tours, and other local services, creating a holistic platform for both travelers and providers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center">
              <div className="rounded-full bg-brand-100 p-3">
                <Globe className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center">Today & Beyond</h3>
            <p className="mt-2 text-gray-600">
              Today, CozyStay operates in over 100 destinations worldwide, with thousands of local providers and happy travelers. We continue to innovate and grow, always focused on our core mission of supporting local tourism and creating authentic travel experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              The passionate individuals behind CozyStay who are dedicated to transforming how people travel and experience new destinations.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-60 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-brand-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Community</h2>
          <p className="mt-4 text-lg text-brand-100 max-w-3xl mx-auto">
            Whether you're a traveler seeking authentic experiences or a local business looking to reach more customers, CozyStay is for you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" className="bg-white text-brand-600 hover:bg-brand-50">
              <Link href="/register">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" className="bg-brand-600 text-white border-white hover:bg-brand-700">
              <Link href="/partner">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            The principles that guide everything we do at CozyStay.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-100 text-brand-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Community First</h3>
              <p className="mt-2 text-gray-600">
                We prioritize building a supportive community of travelers and providers who share our vision of sustainable, authentic travel.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-100 text-brand-600">
                <Globe className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Local Impact</h3>
              <p className="mt-2 text-gray-600">
                We believe in the power of tourism to positively impact local economies and communities when done responsibly.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-100 text-brand-600">
                <Heart className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Authentic Experiences</h3>
              <p className="mt-2 text-gray-600">
                We celebrate the unique character of each destination and encourage travelers to experience local culture and traditions.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-100 text-brand-600">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Quality & Trust</h3>
              <p className="mt-2 text-gray-600">
                We maintain high standards for all providers on our platform to ensure travelers have safe, enjoyable, and memorable experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}