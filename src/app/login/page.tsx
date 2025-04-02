"use client";

import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
 
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
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
          
          <LoginForm />
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 to-brand-800/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1590090442475-9cdaebdf41c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login background"
          fill
          className="object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center p-16 text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome Back to CozyStay</h2>
          <p className="text-xl mb-8">
            Sign in to access your account and continue exploring amazing local experiences.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Book with Confidence</h3>
                <p className="text-white/80">Secure bookings with trusted local providers</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Secure & Private</h3>
                <p className="text-white/80">Your data is always protected</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Easy Payments</h3>
                <p className="text-white/80">Multiple payment options</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">24/7 Support</h3>
                <p className="text-white/80">Help whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}