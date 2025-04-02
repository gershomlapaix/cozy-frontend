import Link from "next/link";
import Image from "next/image";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-600/90 to-brand-800/90 z-10"></div>
        <Image
          src="https://cdn.pixabay.com/photo/2017/08/10/06/58/cup-2619216_1280.jpg"
          alt="Register background"
          fill
          className="object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center p-16 text-white">
          <h2 className="text-3xl font-bold mb-6">Join CozyStay Today</h2>
          <p className="text-xl mb-8">
            Create an account to discover, book, and enjoy amazing local experiences around the world.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Discover Local Gems</h3>
                <p className="mt-1">
                  Find unique accommodations, car rentals, and guided tours from local businesses.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect with Locals</h3>
                <p className="mt-1">
                  Experience authentic hospitality and get insider tips from local hosts.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Your Trips</h3>
                <p className="mt-1">
                  Keep track of your bookings, save favorites, and access exclusive deals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center">
              {/* <Image
                src="/images/logo.svg"
                alt="CozyStay Logo"
                width={40}
                height={40}
              /> */}
              <p className="bg-gray-700 border border-gray-500 py- rounded-md px-2 font-bold text-white text-6xl">C</p>
              <span className="ml-2 text-xl font-bold text-brand-700">CozyStay</span>
            </Link>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}