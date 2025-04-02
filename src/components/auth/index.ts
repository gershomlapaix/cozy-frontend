// types/index.ts

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  provider: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  provider: boolean;
}

// User Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  isProvider: boolean;
  isVerified: boolean;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: number;
  title: string;
  type: ServiceType;
  price: number;
  pricingUnit: PricingUnit;
  capacity?: number;
  thumbnailUrl?: string;
  address: string;
  latitude: number;
  longitude: number;
  avgRating?: number;
  reviewCount?: number;
  isVerified: boolean;
  category: Category;
  images?: string[];
  location: Location;
  user: User;
}

export interface ServiceDetail extends Service {
  description: string;
  amenities: string[];
  policies: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum ServiceType {
  // ACCOMMODATION, TOUR_GUIDE, LOCAL_EVENT, FOOD_EXPERIENCE, TRANSPORTATION, CAR_RENTAL, ACTIVITY
  ACCOMMODATION = "ACCOMMODATION",
  TOUR_GUIDE = "TOUR_GUIDE",
  LOCAL_EVENT = "LOCAL_EVENT",
  FOOD_EXPERIENCE = "FOOD_EXPERIENCE",
  TRANSPORTATION = "TRANSPORTATION",
  CAR_RENTAL = "CAR_RENTAL",
  ACTIVITY = "ACTIVITY"
}

export enum PricingUnit {
  // 'PER_NIGHT' | 'PER_DAY' | 'PER_HOUR' | 'PER_PERSON' | 'FIXED_PRICE';
  PER_NIGHT = "PER_NIGHT",
  PER_DAY = "PER_DAY",
  PER_HOUR = "PER_HOUR",
  PER_PERSON = "PER_PERSON",
  FIXED_PRICE = "FIXED_PRICE",
}

export enum BookingStatus {
  // 'PENDING' | 'CONFIRMED' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_PROVIDER' | 'COMPLETED' | 'NO_SHOW';
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED_BY_USER = "CANCELLED_BY_USER",
  CANCELLED_BY_PROVIDER = "CANCELLED_BY_PROVIDER",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW"
}

// Other Entity Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface Location {
  id: number;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  isPopular: boolean;
  isActive: boolean;
}

// Booking Types
export interface Booking {
  id: number;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  guestCount?: number;
  status: BookingStatus;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  service: Service;
  user: User;
}

// export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_PROVIDER' | 'COMPLETED' | 'NO_SHOW';

// Form Error Type
export interface FormErrors {
  [key: string]: string;
}
