import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="CozyStay Logo"
                width={40}
                height={40}
              />
              <span className="ml-2 text-xl font-bold text-brand-700">CozyStay</span>
            </Link>
            <p className="text-gray-600 text-sm">
              CozyStay helps local businesses in the tourism sector connect with travelers. 
              Find accommodations, car rentals, tours, and more in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-600 hover:text-brand-600">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-brand-600">
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-brand-600">
                  Tours & Activities
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-brand-600">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-gray-600 hover:text-brand-600">
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              For Businesses
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/partner" className="text-gray-600 hover:text-brand-600">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="text-gray-600 hover:text-brand-600">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-brand-600">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/partner-support" className="text-gray-600 hover:text-brand-600">
                  Partner Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  123 Tourism Street, Vacation City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-brand-600 mr-2" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-brand-600 mr-2" />
                <span className="text-gray-600">info@cozystay.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CozyStay. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-brand-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;