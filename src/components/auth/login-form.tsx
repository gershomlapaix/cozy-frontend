"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { FormErrors, LoginRequest } from ".";

type LoginCredentials = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
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
      const response = await authService.login(credentials);

      // Store user data
      localStorage.setItem('user', JSON.stringify({
        id: response.userId,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        isProvider: response.provider,
        roles: response.roles
      }));

      // Redirect to return URL or dashboard
      router.push(returnUrl);
    } catch (err: any) {
      // console.error("Login error:", err);

      if (err.response?.status === 401) {
        setServerError("Invalid username or password. Please try again.");
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("An error occurred during login. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign in to your account</h2>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500`}
              placeholder="Enter your password"
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
          <div className="mt-1 text-right">
            <Link href="/#" className="text-sm text-brand-600 hover:text-brand-500">
              Forgot your password?
            </Link>
          </div>
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
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </>
          )}
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;