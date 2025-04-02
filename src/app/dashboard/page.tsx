"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  User, Mail, Phone, MapPin, Calendar, Star,
  Edit, Upload, Shield
} from "lucide-react";
import api from "@/services/api";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  verified: boolean;
  avatarUrl: string;
  reviewsCount: number;
  bookingsCount: number;
  isProvider: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "Travel enthusiast and food lover. Always looking for new experiences and places to explore.",
    joinDate: "March 2023",
    verified: true,
    avatarUrl: "/images/user-avatar.jpg",
    reviewsCount: 7,
    bookingsCount: 12,
    isProvider: false
  })
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<UserProfile>('/users/me');
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account details and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-brand-600">
          <div className="absolute -bottom-12 left-8">
            <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
              <Image
                src={"https://cdn.pixabay.com/photo/2023/06/23/11/23/ai-generated-8083323_1280.jpg"}
                alt={`${profile.firstName}'s avatar`}
                fill
                className="object-cover"
              />
              <button className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                {profile.verified && (
                  <div className="ml-2 flex items-center text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {profile.joinDate}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-brand-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{profile.bookingsCount}</p>
                  <p className="ml-2 text-gray-600">{profile.isProvider ? 'received' : 'made'}</p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {profile.isProvider
                    ? 'Total bookings received for your listings'
                    : 'Total bookings you have made'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-brand-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{profile.reviewsCount}</p>
                  <p className="ml-2 text-gray-600">{profile.isProvider ? 'received' : 'written'}</p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {profile.isProvider
                    ? 'Reviews from guests who used your services'
                    : 'Reviews you have written for services'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              </div>
              <div>
                <Button variant="outline" className="w-full sm:w-auto">Privacy Settings</Button>
              </div>
              {!profile.isProvider && (
                <div>
                  <Button variant="outline" className="w-full sm:w-auto">Become a Provider</Button>
                </div>
              )}
              <div>
                <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:bg-red-50 hover:border-red-200">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}