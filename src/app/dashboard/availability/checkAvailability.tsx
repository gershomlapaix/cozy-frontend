"use client";

import { useState, useEffect } from "react";
import { format, parseISO, addDays, isAfter, isBefore, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { availabilityAPI } from "@/services/api";

interface Availability {
  id: number;
  startDateTime: string;
  endDateTime: string;
  isAvailable: boolean;
  notes?: string;
}

interface CheckAvailabilityProps {
  serviceId: number;
  serviceType: string;
  pricingUnit: string;
  onDateTimeSelect: (startDateTime: string, endDateTime: string) => void;
}

const availableTimeSlots = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

const CheckAvailability = ({ 
  serviceId, 
  serviceType, 
  pricingUnit, 
  onDateTimeSelect 
}: CheckAvailabilityProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availableStartTimes, setAvailableStartTimes] = useState<string[]>([]);
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  
  // Flag to determine if we show end date/time based on service type and pricing unit
  const showEndDateTime = ['ACCOMMODATION', 'CAR_RENTAL'].includes(serviceType) || 
                         ['PER_NIGHT', 'PER_DAY', 'PER_HOUR'].includes(pricingUnit);
  
  // For accommodations, end date should be at least 1 day after start date
  useEffect(() => {
    if (startDate && ['ACCOMMODATION'].includes(serviceType)) {
      const minEndDate = addDays(startDate, 1);
      if (!endDate || isBefore(endDate, minEndDate)) {
        setEndDate(minEndDate);
      }
    }
  }, [startDate, serviceType]);
  
  // Fetch availability when start date changes
  useEffect(() => {
    if (startDate) {
      fetchAvailability();
    }
  }, [startDate]);
  
  // Update available times when availabilities change
  useEffect(() => {
    updateAvailableTimes();
  }, [availabilities, startDate, endDate]);
  
  // Check for valid selection
  useEffect(() => {
    let isValid = false;
    
    if (startDate && startTime) {
      if (showEndDateTime) {
        isValid = !!endDate && !!endTime;
      } else {
        isValid = true;
      }
    }
    
    setValidated(isValid);
    
    if (isValid) {
      // Create the full date time strings
      const start = new Date(startDate);
      const [startHour, startMinutes] = startTime.split(':').map(Number);
      start.setHours(startHour, startMinutes, 0, 0);
      
      let end;
      if (showEndDateTime && endDate && endTime) {
        end = new Date(endDate);
        const [endHour, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHour, endMinutes, 0, 0);
      } else {
        // For fixed price or per-person services, set end time as 1 hour after start
        end = new Date(start);
        end.setHours(end.getHours() + 1);
      }
      
      onDateTimeSelect(start.toISOString(), end.toISOString());
    }
  }, [startDate, endDate, startTime, endTime, showEndDateTime]);
  
  const fetchAvailability = async () => {
    if (!startDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const start = startOfDay(startDate);
      const end = startOfDay(addDays(startDate, showEndDateTime ? 7 : 0));
      
      const response = await availabilityAPI.getAvailabilitiesBetweenDates(
        serviceId,
        start.toISOString(),
        end.toISOString()
      );
      
      setAvailabilities(response.data);
    } catch (err: any) {
      console.error("Error fetching availabilities:", err);
      setError(err.response?.data?.message || "Failed to check availability");
    } finally {
      setLoading(false);
    }
  };
  
  const updateAvailableTimes = () => {
    if (!startDate) {
      setAvailableStartTimes([]);
      setAvailableEndTimes([]);
      return;
    }
    
    // Filter availabilities for the selected start date
    const startDateAvailabilities = availabilities.filter(avail => {
      const availStartDate = parseISO(avail.startDateTime);
      const availEndDate = parseISO(avail.endDateTime);
      
      return avail.isAvailable && (
        isSameDay(startDate, availStartDate) || 
        (isAfter(startDate, availStartDate) && isBefore(startDate, availEndDate))
      );
    });
    
    // Get available start times
    const startTimes = availableTimeSlots.filter(timeSlot => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const dateTime = setHours(setMinutes(startDate, minute), hour);
      
      return startDateAvailabilities.some(avail => {
        const availStart = parseISO(avail.startDateTime);
        const availEnd = parseISO(avail.endDateTime);
        return isAfter(dateTime, availStart) && isBefore(dateTime, availEnd);
      });
    });
    
    setAvailableStartTimes(startTimes);
    
    // If we have an end date, update available end times
    if (endDate && showEndDateTime) {
      const endDateAvailabilities = availabilities.filter(avail => {
        const availStartDate = parseISO(avail.startDateTime);
        const availEndDate = parseISO(avail.endDateTime);
        
        return avail.isAvailable && (
          isSameDay(endDate, availStartDate) || 
          (isAfter(endDate, availStartDate) && isBefore(endDate, availEndDate))
        );
      });
      
      const endTimes = availableTimeSlots.filter(timeSlot => {
        const [hour, minute] = timeSlot.split(':').map(Number);
        const dateTime = setHours(setMinutes(endDate, minute), hour);
        
        // For same-day bookings, ensure end time is after start time
        if (isSameDay(startDate, endDate) && startTime) {
          if (timeSlot <= startTime) return false;
        }
        
        return endDateAvailabilities.some(avail => {
          const availStart = parseISO(avail.startDateTime);
          const availEnd = parseISO(avail.endDateTime);
          return isAfter(dateTime, availStart) && isBefore(dateTime, availEnd);
        });
      });
      
      setAvailableEndTimes(endTimes);
    } else {
      setAvailableEndTimes([]);
    }
  };
  
  const clearEndDateTimeIfInvalid = () => {
    if (startDate && endDate) {
      if (isBefore(endDate, startDate) || 
          (isSameDay(startDate, endDate) && endTime && startTime && endTime <= startTime)) {
        setEndDate(undefined);
        setEndTime(undefined);
      }
    }
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    clearEndDateTimeIfInvalid();
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate && isBefore(date, startDate)) {
      // Can't select end date before start date
      return;
    }
    setEndDate(date);
    clearEndDateTimeIfInvalid();
  };
  
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(e.target.value);
    clearEndDateTimeIfInvalid();
  };
  
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(e.target.value);
  };
  
  // Determine min end date based on start date and service type
  const getMinEndDate = () => {
    if (!startDate) return new Date();
    
    if (['ACCOMMODATION'].includes(serviceType)) {
      return addDays(startDate, 1);
    }
    
    return startDate;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Check Availability</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={loading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "EEEE, MMMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              initialFocus
              disabled={(date) => {
                // Disable dates in the past
                return isBefore(date, startOfDay(new Date()));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Start Time */}
      {startDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <div className="relative">
            <select
              value={startTime || ""}
              onChange={handleStartTimeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              disabled={availableStartTimes.length === 0 || loading}
            >
              <option value="">Select time</option>
              {availableStartTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {availableStartTimes.length === 0 && !loading && (
            <p className="mt-1 text-sm text-red-600">
              No available times for this date
            </p>
          )}
        </div>
      )}
      
      {/* End Date (for accommodations and rentals) */}
      {showEndDateTime && startDate && startTime && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "EEEE, MMMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                disabled={(date) => {
                  // Disable dates before min end date
                  return isBefore(date, getMinEndDate());
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* End Time (for accommodations and rentals) */}
      {showEndDateTime && endDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <div className="relative">
            <select
              value={endTime || ""}
              onChange={handleEndTimeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              disabled={availableEndTimes.length === 0 || loading}
            >
              <option value="">Select time</option>
              {availableEndTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {availableEndTimes.length === 0 && !loading && (
            <p className="mt-1 text-sm text-red-600">
              No available times for this date
            </p>
          )}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 text-brand-600 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Checking availability...</span>
        </div>
      )}
      
      {validated && !loading && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <div>
            <p className="text-green-700 font-medium">
              Available for booking!
            </p>
            <p className="text-green-600 text-sm">
              {format(startDate, "MMM d, yyyy")} at {startTime}
              {showEndDateTime && endDate && endTime && (
                <> to {format(endDate, "MMM d, yyyy")} at {endTime}</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckAvailability;