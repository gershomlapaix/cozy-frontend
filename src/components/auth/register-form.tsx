"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormErrors, RegisterRequest } from ".";
import { authService } from "@/services/authService";

type RegisterData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  provider: boolean;
};

const RegisterForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    provider: true,
    confirmPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear server error when user types
    if (serverError) {
      setServerError(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);

    // Clear password match error when typing
    if (errors.confirmPassword) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await authService.register({...formData, provider: formData.provider});

      // After successful registration, redirect to login page or login automatically
      router.push('/login?registrationSuccess=true');
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("An error occurred during registration. Please try again later.");
      }

      // Handle specific field errors from the API response
      if (err.response?.data?.errors) {
        const fieldErrors: FormErrors = {};
        for (const [field, message] of Object.entries(err.response.data.errors)) {
          fieldErrors[field] = message as string;
        }
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create your account</h2>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username*
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
            placeholder="+1 (123) 456-7890"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password*
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password*
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="provider"
              name="provider"
              type="checkbox"
              checked={formData.provider}
              onChange={handleChange}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
            />
            <label htmlFor="provider" className="ml-2 block text-sm text-gray-900">
              Register as a service provider
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Select this option if you want to list your accommodations, car rentals, or tours
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={`h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded ${errors.terms ? 'border-red-500' : ''
                }`}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <Link href="/terms" className="text-brand-600 hover:text-brand-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-600 hover:text-brand-500">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Sign up
            </>
          )}
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500">
            Sign in
          </Link>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-brand-600 hover:text-brand-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand-600 hover:text-brand-500">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;