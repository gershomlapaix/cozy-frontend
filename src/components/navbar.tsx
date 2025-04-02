"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Accommodations", href: "/services" },
    { name: "Car Rentals", href: "/services" },
    { name: "Tours", href: "/services" },
    { name: "About Us", href: "/about" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/logo.svg"
                alt="CozyStay Logo"
                width={40}
                height={40}
              />
              <span className="ml-2 text-xl font-bold text-brand-700">CozyStay</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.href)
                      ? "border-brand-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-brand-50 border-brand-500 text-brand-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">Sign in</Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;