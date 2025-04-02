"use client";

import { useState, useEffect } from "react";
import { format, parseISO, startOfMonth, endOfMonth, addMonths, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { availabilityAPI } from "@/services/api";

interface Availability {
  id: number;
  startDateTime: string;
  endDateTime: string;
  isAvailable: boolean;
  notes?: string;
}

interface AvailabilityCalendarProps {
  serviceId: number;
  onDateSelect?: (date: Date, availabilities: Availability[]) => void;
  className?: string;
}

const AvailabilityCalendar = ({ serviceId, onDateSelect, className = "" }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (serviceId) {
      fetchAvailabilities();
    }
  }, [serviceId, currentMonth]);
  
  const fetchAvailabilities = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      const response = await availabilityAPI.getAvailabilitiesBetweenDates(
        serviceId,
        start.toISOString(),
        end.toISOString()
      );
      
      setAvailabilities(response.data);
    } catch (err: any) {
      console.error("Error fetching availabilities:", err);
      setError(err.response?.data?.message || "Failed to load availabilities");
    } finally {
      setLoading(false);
    }
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  const getDayStatus = (date: Date) => {
    const dayAvailabilities = availabilities.filter(availability => {
      const startDate = parseISO(availability.startDateTime);
      const endDate = parseISO(availability.endDateTime);
      return isSameDay(date, startDate) || isSameDay(date, endDate);
    });
    
    if (dayAvailabilities.length === 0) return "unknown";
    
    // Check if any availability is marked as available
    const hasAvailable = dayAvailabilities.some(a => a.isAvailable);
    
    return hasAvailable ? "available" : "unavailable";
  };
  
  const handleDateClick = (date: Date) => {
    if (!onDateSelect) return;
    
    const dayAvailabilities = availabilities.filter(availability => {
      const startDate = parseISO(availability.startDateTime);
      const endDate = parseISO(availability.endDateTime);
      return isSameDay(date, startDate) || isSameDay(date, endDate);
    });
    
    onDateSelect(date, dayAvailabilities);
  };
  
  // Generate days of the month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-start-${i}`} className="p-2 h-10"></div>
        ))}
        
        {/* Days of the month */}
        {daysInMonth.map(day => {
          const status = getDayStatus(day);
          let statusColor = "bg-gray-100";
          let statusIcon = null;
          
          if (status === "available") {
            statusColor = "bg-green-100 hover:bg-green-200";
            statusIcon = <Check className="h-3 w-3 text-green-600 absolute top-1 right-1" />;
          } else if (status === "unavailable") {
            statusColor = "bg-red-100 hover:bg-red-200";
            statusIcon = <X className="h-3 w-3 text-red-600 absolute top-1 right-1" />;
          }
          
          return (
            <div
              key={day.toISOString()}
              className={`p-2 h-10 relative rounded cursor-pointer ${statusColor}`}
              onClick={() => handleDateClick(day)}
            >
              <span className="text-sm">{format(day, "d")}</span>
              {statusIcon}
            </div>
          );
        })}
        
        {/* Empty cells for days after the last of the month */}
        {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
          <div key={`empty-end-${i}`} className="p-2 h-10"></div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 rounded-full mr-1"></div>
          <span>Not Set</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;