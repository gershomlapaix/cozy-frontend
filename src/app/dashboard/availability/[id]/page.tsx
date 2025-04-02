"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format, parseISO, addDays, isAfter, isBefore, isEqual, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock, Save, Plus, Trash2, ArrowLeft, Info, Loader2, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";

interface Availability {
    id: number;
    startDateTime: string;
    endDateTime: string;
    isAvailable: boolean;
    notes?: string;
}

interface AvailabilityRequest {
    serviceId: number;
    startDateTime: string;
    endDateTime: string;
    isAvailable: boolean;
    notes?: string;
}

interface Service {
    id: number;
    title: string;
    type: string;
}

const timeSlots = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

export default function AvailabilityManagementPage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = parseInt(params.id as string);

    const [loading, setLoading] = useState(true);
    const [service, setService] = useState<Service | null>(null);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
        [key: string]: boolean;
    }>({});
    const [isTimeSlotSettingAvailable, setIsTimeSlotSettingAvailable] = useState(true);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [view, setView] = useState<"day" | "bulk">("day");
    const [bulkStartDate, setBulkStartDate] = useState<Date | undefined>(new Date());
    const [bulkEndDate, setBulkEndDate] = useState<Date | undefined>(addDays(new Date(), 30));
    const [bulkOption, setBulkOption] = useState<"weekdays" | "weekends" | "all">("all");
    const [bulkStartTime, setBulkStartTime] = useState("09:00");
    const [bulkEndTime, setBulkEndTime] = useState("17:00");
    const [bulkIsAvailable, setBulkIsAvailable] = useState(true);
    const [bulkNotes, setBulkNotes] = useState("");    

    // Fetch service details and availabilities
    useEffect(() => {
        const fetchServiceAndAvailabilities = async () => {
            setLoading(true);
            try {
                // Fetch service details
                const serviceResponse = await api.get(`/services/${serviceId}`);
                setService(serviceResponse.data);

                // Fetch availabilities for current month
                await fetchAvailabilities();
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || "Failed to load service or availabilities");
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceAndAvailabilities();
        }
    }, [serviceId]);

    // Fetch availabilities for the selected date
    const fetchAvailabilities = async () => {
        if (!selectedDate) return;

        try {
            const startDate = new Date(selectedDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(selectedDate);
            endDate.setHours(23, 59, 59, 999);

            const response = await api.get(`/availabilities/service/${serviceId}/dates`, {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            });

            setAvailabilities(response.data);
            updateTimeSlotSelections(response.data);
        } catch (err: any) {
            console.error("Error fetching availabilities:", err);
            setError(err.response?.data?.message || "Failed to load availabilities");
        }
    };

    // Update time slot selections based on fetched availabilities
    const updateTimeSlotSelections = (availabilityData: Availability[]) => {
        const newTimeSlotSelections: { [key: string]: boolean } = {};

        // Initialize all time slots as available
        timeSlots.forEach(timeSlot => {
            newTimeSlotSelections[timeSlot] = true;
        });

        // Update based on availabilities
        availabilityData.forEach(availability => {
            const startTime = format(parseISO(availability.startDateTime), "HH:mm");
            const endTime = format(parseISO(availability.endDateTime), "HH:mm");

            // Find all slots that fall within this availability
            timeSlots.forEach(timeSlot => {
                if (timeSlot >= startTime && timeSlot < endTime) {
                    newTimeSlotSelections[timeSlot] = availability.isAvailable;
                }
            });
        });

        setSelectedTimeSlots(newTimeSlotSelections);

        // If there are availabilities for this day, use the notes from the first one
        if (availabilityData.length > 0) {
            setNotes(availabilityData[0].notes || "");
            setIsTimeSlotSettingAvailable(availabilityData[0].isAvailable);
        } else {
            setNotes("");
            setIsTimeSlotSettingAvailable(true);
        }
    };

    // Save daily availability
    const saveDailyAvailability = async () => {
        if (!selectedDate) return;

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Group consecutive time slots with the same availability status
            const timeRanges: {
                start: string;
                end: string;
                isAvailable: boolean;
            }[] = [];

            let currentRange: {
                start: string;
                end: string;
                isAvailable: boolean;
            } | null = null;

            timeSlots.forEach((timeSlot, index) => {
                const isAvailable = selectedTimeSlots[timeSlot];

                if (!currentRange) {
                    // Start a new range
                    currentRange = {
                        start: timeSlot,
                        end: index < timeSlots.length - 1 ? timeSlots[index + 1] : "00:00", // Next day if last slot
                        isAvailable
                    };
                } else if (currentRange.isAvailable === isAvailable) {
                    // Extend the current range
                    currentRange.end = index < timeSlots.length - 1 ? timeSlots[index + 1] : "00:00"; // Next day if last slot
                } else {
                    // Save the current range and start a new one
                    timeRanges.push(currentRange);
                    currentRange = {
                        start: timeSlot,
                        end: index < timeSlots.length - 1 ? timeSlots[index + 1] : "00:00", // Next day if last slot
                        isAvailable
                    };
                }
            });

            // Add the last range if it exists
            if (currentRange) {
                timeRanges.push(currentRange);
            }

            // Convert time ranges to API requests
            const requests: AvailabilityRequest[] = timeRanges.map(range => {
                const [startHour, startMinute] = range.start.split(":").map(Number);
                const [endHour, endMinute] = range.end.split(":").map(Number);

                const startDateTime = new Date(selectedDate);
                startDateTime.setHours(startHour, startMinute, 0, 0);

                const endDateTime = new Date(selectedDate);
                if (endHour === 0 && endMinute === 0) {
                    // If end time is 00:00, it means the end of the day
                    endDateTime.setDate(endDateTime.getDate() + 1);
                }
                endDateTime.setHours(endHour, endMinute, 0, 0);

                return {
                    serviceId,
                    startDateTime: startDateTime.toISOString(),
                    endDateTime: endDateTime.toISOString(),
                    isAvailable: range.isAvailable,
                    notes: notes
                };
            });

            // First, delete any existing availabilities for this day
            // Then create new ones
            const deleteStartOfDay = new Date(selectedDate);
            deleteStartOfDay.setHours(0, 0, 0, 0);

            const deleteEndOfDay = new Date(selectedDate);
            deleteEndOfDay.setHours(23, 59, 59, 999);

            // Get existing availabilities for this day
            const existingAvailabilities = await api.get(`/availabilities/service/${serviceId}`, {
                params: {
                    startDate: deleteStartOfDay.toISOString(),
                    endDate: deleteEndOfDay.toISOString()
                }
            });

            // Delete existing availabilities
            for (const availability of existingAvailabilities.data) {
                await api.delete(`/availabilities/${availability.id}`);
            }

            // Create new availabilities in bulk
            await api.post(`/availabilities/bulk`, requests);

            setSuccess("Availability updated successfully");
            await fetchAvailabilities(); // Refresh the data
        } catch (err: any) {
            console.error("Error saving availabilities:", err);
            setError(err.response?.data?.message || "Failed to save availabilities");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save bulk availability
    const saveBulkAvailability = async () => {
        if (!bulkStartDate || !bulkEndDate) {
            setError("Please select start and end dates");
            return;
        }

        if (isAfter(bulkStartDate, bulkEndDate)) {
            setError("Start date must be before end date");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const [startHour, startMinute] = bulkStartTime.split(":").map(Number);
            const [endHour, endMinute] = bulkEndTime.split(":").map(Number);

            const requests: AvailabilityRequest[] = [];

            // Generate a date for each day in the range
            let currentDate = new Date(bulkStartDate);

            while (isBefore(currentDate, bulkEndDate) || isEqual(currentDate, bulkEndDate)) {
                const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isWeekday = !isWeekend;

                // Check if we should include this day based on the bulk option
                if (
                    (bulkOption === "all") ||
                    (bulkOption === "weekdays" && isWeekday) ||
                    (bulkOption === "weekends" && isWeekend)
                ) {
                    // Create availability for this day
                    const startDateTime = new Date(currentDate);
                    startDateTime.setHours(startHour, startMinute, 0, 0);

                    const endDateTime = new Date(currentDate);
                    endDateTime.setHours(endHour, endMinute, 0, 0);

                    requests.push({
                        serviceId,
                        startDateTime: startDateTime.toISOString(),
                        endDateTime: endDateTime.toISOString(),
                        isAvailable: bulkIsAvailable,
                        notes: bulkNotes
                    });
                }

                // Move to the next day
                currentDate = addDays(currentDate, 1);
            }

            // Create availabilities in bulk
            await api.post(`/availabilities/bulk`, requests);

            setSuccess("Bulk availability created successfully");
        } catch (err: any) {
            console.error("Error creating bulk availabilities:", err);
            setError(err.response?.data?.message || "Failed to create bulk availabilities");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle availability for all time slots
    const toggleAllTimeSlots = () => {
        const newIsAvailable = !isTimeSlotSettingAvailable;
        setIsTimeSlotSettingAvailable(newIsAvailable);

        const newTimeSlotSelections = { ...selectedTimeSlots };
        Object.keys(newTimeSlotSelections).forEach(timeSlot => {
            newTimeSlotSelections[timeSlot] = newIsAvailable;
        });

        setSelectedTimeSlots(newTimeSlotSelections);
    };

    // Handle date change
    const handleDateChange = async (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setLoading(true);

            try {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);

                const response = await api.get(`/availabilities/service/${serviceId}`, {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    }
                });

                setAvailabilities(response.data);
                updateTimeSlotSelections(response.data);
            } catch (err: any) {
                console.error("Error fetching availabilities:", err);
                setError(err.response?.data?.message || "Failed to load availabilities");
            } finally {
                setLoading(false);
            }
        }
    };

    // Toggle a single time slot
    const toggleTimeSlot = (timeSlot: string) => {
        setSelectedTimeSlots(prev => ({
            ...prev,
            [timeSlot]: !prev[timeSlot]
        }));
    };

    if (loading && !service) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <Link href={`/dashboard/listings`} className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Listings
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
                <p className="text-gray-600">
                    {service?.title} - Set when your service is available for booking
                </p>
            </div>

            {/* Success message */}
            {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-green-600"
                        onClick={() => setSuccess(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}

            {/* Error message */}
            {error && (
                <Alert className="mb-6" variant="destructive">
                    <Info className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-destructive"
                        onClick={() => setError(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}

            {/* View toggle */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setView("day")}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${view === "day"
                                    ? "border-brand-500 text-brand-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Daily Availability
                        </button>
                        <button
                            onClick={() => setView("bulk")}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${view === "bulk"
                                    ? "border-brand-500 text-brand-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Bulk Set Availability
                        </button>
                    </nav>
                </div>
            </div>

            {/* Daily availability view */}
            {view === "day" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:space-x-6">
                        {/* Calendar */}
                        <div className="md:w-1/3 mb-6 md:mb-0">
                            <h2 className="text-lg font-semibold mb-4">Select Date</h2>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                className="rounded-md border w-full"
                            />

                            {loading && (
                                <div className="mt-4 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 text-brand-600 animate-spin mr-2" />
                                    <span className="text-sm text-gray-600">Loading availability...</span>
                                </div>
                            )}
                        </div>

                        {/* Time slots */}
                        <div className="md:w-2/3">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    Availability for {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
                                </h2>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="toggle-all"
                                        checked={isTimeSlotSettingAvailable}
                                        onCheckedChange={toggleAllTimeSlots}
                                        className="mr-2"
                                    />
                                    <label htmlFor="toggle-all" className="text-sm font-medium">
                                        {isTimeSlotSettingAvailable ? "Set All Available" : "Set All Unavailable"}
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                                {timeSlots.map(timeSlot => (
                                    <div
                                        key={timeSlot}
                                        className={`border rounded-md p-2 cursor-pointer flex items-center justify-between ${selectedTimeSlots[timeSlot]
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                            }`}
                                        onClick={() => toggleTimeSlot(timeSlot)}
                                    >
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{timeSlot}</span>
                                        </div>
                                        <div className={selectedTimeSlots[timeSlot] ? "text-green-600" : "text-red-600"}>
                                            {selectedTimeSlots[timeSlot] ? "Available" : "Unavailable"}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                </label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about availability"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={saveDailyAvailability}
                                    disabled={isSubmitting}
                                    className="flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Availability
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk availability view */}
            {view === "bulk" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Create Bulk Availability</h2>
                        <p className="text-gray-600 text-sm">
                            Set availability for multiple days at once. This will create new availability slots and won't affect existing ones.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Range
                            </label>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="justify-start text-left font-normal w-full"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {bulkStartDate ? format(bulkStartDate, "MMM d, yyyy") : "Select start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={bulkStartDate}
                                                onSelect={setBulkStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <span>to</span>
                                <div className="relative">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="justify-start text-left font-normal w-full"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {bulkEndDate ? format(bulkEndDate, "MMM d, yyyy") : "Select end date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={bulkEndDate}
                                                onSelect={setBulkEndDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        {/* Days selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apply To
                            </label>
                            <div className="flex space-x-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="all-days"
                                        name="days-option"
                                        value="all"
                                        checked={bulkOption === "all"}
                                        onChange={() => setBulkOption("all")}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="all-days" className="ml-2 block text-sm text-gray-700">
                                        All Days
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="weekdays"
                                        name="days-option"
                                        value="weekdays"
                                        checked={bulkOption === "weekdays"}
                                        onChange={() => setBulkOption("weekdays")}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="weekdays" className="ml-2 block text-sm text-gray-700">
                                        Weekdays
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="weekends"
                                        name="days-option"
                                        value="weekends"
                                        checked={bulkOption === "weekends"}
                                        onChange={() => setBulkOption("weekends")}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="weekends" className="ml-2 block text-sm text-gray-700">
                                        Weekends
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Time range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time Range
                            </label>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={bulkStartTime}
                                    onChange={(e) => setBulkStartTime(e.target.value)}
                                    className="rounded-md border border-gray-300 p-2 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    {timeSlots.map(time => (
                                        <option key={`start-${time}`} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                                <span>to</span>
                                <select
                                    value={bulkEndTime}
                                    onChange={(e) => setBulkEndTime(e.target.value)}
                                    className="rounded-md border border-gray-300 p-2 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    {timeSlots.map(time => (
                                        <option key={`end-${time}`} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Availability status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Availability Status
                            </label>
                            <div className="flex space-x-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="available"
                                        name="availability-status"
                                        checked={bulkIsAvailable}
                                        onChange={() => setBulkIsAvailable(true)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                                        Available
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="unavailable"
                                        name="availability-status"
                                        checked={!bulkIsAvailable}
                                        onChange={() => setBulkIsAvailable(false)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="unavailable" className="ml-2 block text-sm text-gray-700">
                                        Unavailable
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label htmlFor="bulk-notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Notes (optional)
                            </label>
                            <Textarea
                                id="bulk-notes"
                                value={bulkNotes}
                                onChange={(e) => setBulkNotes(e.target.value)}
                                placeholder="Add any notes about availability"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={saveBulkAvailability}
                            disabled={isSubmitting}
                            className="flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Bulk Availability
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Guide/help section */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-800 font-medium flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    How Availability Works
                </h3>
                <ul className="mt-2 text-blue-700 text-sm space-y-1">
                    <li>• Set which times your service is available for booking</li>
                    <li>• Customers can only book during available time slots</li>
                    <li>• Green slots are available, red slots are unavailable</li>
                    <li>• Use bulk mode to quickly set availability for multiple days</li>
                    <li>• You can always update or delete availability later</li>
                </ul>
            </div>
        </div>
    )
}