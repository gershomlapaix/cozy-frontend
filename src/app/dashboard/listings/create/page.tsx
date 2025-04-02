"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Plus, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";
import { PricingUnit, ServiceType } from "@/components/auth";

interface CreateServiceRequest {
  title: string;
  description: string;
  type: ServiceType;
  price: number;
  pricingUnit: PricingUnit;
  capacity?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  policies: string[];
  categoryId: number;
  locationId: number;
}

export default function CreateListingPage() {
  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { locations, isLoading: locationsLoading } = useLocations();
  
  const [formData, setFormData] = useState<{
    type: ServiceType;
    title: string;
    description: string;
    categoryId: string;
    locationId: string;
    address: string;
    latitude: string;
    longitude: string;
    capacity: string;
    price: string;
    pricingUnit: PricingUnit;
    amenities: string[];
    policies: string[];
  }>({
    type: ServiceType.ACCOMMODATION,
    title: "",
    description: "",
    categoryId: "",
    locationId: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity: "",
    price: "",
    pricingUnit: PricingUnit.PER_NIGHT,
    amenities: [],
    policies: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
  const [newAmenity, setNewAmenity] = useState("");
  const [newPolicy, setNewPolicy] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityAdd = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const handleAmenityRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handlePolicyAdd = () => {
    if (newPolicy.trim()) {
      setFormData(prev => ({
        ...prev,
        policies: [...prev.policies, newPolicy.trim()]
      }));
      setNewPolicy("");
    }
  };

  const handlePolicyRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Create preview URLs for client-side display
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      // Add to existing images
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setImageFiles(prev => [...prev, ...filesArray]);
      
      // Set first image as thumbnail if none is set
      if (imageFiles.length === 0) {
        setThumbnailIndex(0);
      }
    }
  };

  const handleImageRemove = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    // Remove image from arrays
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // Update thumbnail index if needed
    if (thumbnailIndex === index) {
      // Set to first image, or -1 if no images left
      setThumbnailIndex(imageFiles.length > 1 ? 0 : -1);
    } else if (thumbnailIndex > index) {
      // Adjust index since we removed an image before the current thumbnail
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const setThumbnail = (index: number) => {
    setThumbnailIndex(index);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSubmitting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setIsSubmitting(false);
          setUseGeolocation(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get your current location. Please enter coordinates manually.");
          setIsSubmitting(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser. Please enter coordinates manually.");
    }
  };

  const validateForm = (): boolean => {
    // Check if we have at least one image
    if (imageFiles.length === 0) {
      setError("Please upload at least one image");
      return false;
    }

    // Check required fields
    if (!formData.title || !formData.description || !formData.price || 
        !formData.address || !formData.categoryId || !formData.locationId) {
      setError("Please fill all required fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Prepare service data for JSON part
      const serviceData: CreateServiceRequest = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: parseFloat(formData.price),
        pricingUnit: formData.pricingUnit,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        amenities: formData.amenities,
        policies: formData.policies,
        categoryId: parseInt(formData.categoryId),
        locationId: parseInt(formData.locationId)
      };

      // Create FormData object for multipart request
      const formDataToSend = new FormData();
      
      // Add JSON data as a string in the 'dto' part
      formDataToSend.append('dto', JSON.stringify(serviceData));
      
      // Add each image file
      imageFiles.forEach((file, index) => {
        // Mark the thumbnail image by adding it first
        if (index === thumbnailIndex) {
          formDataToSend.append('images', file, 'thumbnail_' + file.name);
        } else {
          formDataToSend.append('images', file);
        }
      });

      // Submit to API with progress tracking
      const response = await api.post('/services', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      // Redirect to dashboard on success
      router.push("/dashboard/listings");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      setError(error.response?.data?.message || "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/dashboard/listings" className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Listings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600">Add a new service to your offerings</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Service Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value={ServiceType.ACCOMMODATION}>Accommodation</option>
                  <option value={ServiceType.TRANSPORTATION}>Transportation</option>
                  <option value={ServiceType.TOUR_GUIDE}>Tour Guide</option>
                  {/* <option value={ServiceType.EXPERIENCE}>Experience</option>
                  <option value={ServiceType.FOOD}>Food</option>
                  <option value={ServiceType.EQUIPMENT}>Equipment</option> */}
                </select>
              </div>
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Describe your service in detail"
                />
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">Select a category</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesLoading && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
              </div>
              
              {/* Capacity (for accommodations, transportation, etc.) */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Number of guests, passengers, etc."
                />
              </div>
            </div>
          </div>
          
          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <select
                  id="locationId"
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  required
                  disabled={locationsLoading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">Select a location</option>
                  {locations?.map(location => (
                    <option key={location.id} value={location.id.toString()}>
                      {location.city}, {location.country}
                    </option>
                  ))}
                </select>
                {locationsLoading && <p className="text-sm text-gray-500 mt-1">Loading locations...</p>}
              </div>
              
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Enter the full address"
                />
              </div>
              
              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
              
              {/* Get Current Location Button */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isSubmitting}
                  className="inline-flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {useGeolocation ? 'Update My Current Location' : 'Use My Current Location'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  This will fill in the latitude and longitude fields based on your current location
                </p>
              </div>
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {/* Pricing Unit */}
              <div>
                <label htmlFor="pricingUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Unit*
                </label>
                <select
                  id="pricingUnit"
                  name="pricingUnit"
                  value={formData.pricingUnit}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value={PricingUnit.PER_NIGHT}>Per Night</option>
                  <option value={PricingUnit.PER_DAY}>Per Day</option>
                  <option value={PricingUnit.PER_HOUR}>Per Hour</option>
                  <option value={PricingUnit.PER_PERSON}>Per Person</option>
                  <option value={PricingUnit.FIXED_PRICE}>Fixed Price</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Amenities Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities/Features</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Add Amenity */}
              <div>
                <label htmlFor="new-amenity" className="block text-sm font-medium text-gray-700 mb-1">
                  Add Amenities
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="new-amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="E.g., Free Wi-Fi, Parking, etc."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAmenityAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAmenityAdd}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </button>
                </div>
              </div>
              
              {/* Amenities List */}
              {formData.amenities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Added Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleAmenityRemove(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Policies Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Add Policy */}
              <div>
                <label htmlFor="new-policy" className="block text-sm font-medium text-gray-700 mb-1">
                  Add Policies
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="new-policy"
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="E.g., No smoking, Check-in at 3 PM, etc."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePolicyAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handlePolicyAdd}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </button>
                </div>
              </div>
              
              {/* Policies List */}
              {formData.policies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Added Policies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.policies.map((policy, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{policy}</span>
                        <button
                          type="button"
                          onClick={() => handlePolicyRemove(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Images Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={isSubmitting}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB (first selected image will be the thumbnail)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Uploaded Images ({imagePreviewUrls.length})
                    </label>
                    <p className="text-xs text-gray-500">
                      Click an image to set it as the thumbnail
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <div 
                          className={`relative h-32 w-full rounded-md overflow-hidden cursor-pointer ${
                            thumbnailIndex === index ? 'ring-2 ring-brand-500' : ''
                          }`}
                          onClick={() => setThumbnail(index)}
                        >
                          <Image
                            src={url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {thumbnailIndex === index && (
                            <div className="absolute top-1 left-1 bg-brand-500 text-white text-xs rounded-full px-2 py-0.5">
                              Thumbnail
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-brand-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}