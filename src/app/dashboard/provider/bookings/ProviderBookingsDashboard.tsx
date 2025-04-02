"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO, differenceInDays } from "date-fns";
import {
    Clock, AlertCircle,
    Calendar, MapPin, User, Search, Filter,
    ArrowUpDown, ChevronLeft, ChevronRight,
    DollarSign, Loader2, CalendarClock, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";
import { BookingStatus, ServiceType } from "@/components/auth";

interface ProviderBookingsProps {
    initialTab?: string;
}

export default function ProviderBookingsDashboard({ initialTab = "all" }: ProviderBookingsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [bookings, setBookings] = useState<any[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>("startDateTime");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);
    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
        revenue: 0
    });
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch bookings on component mount and when tab/sort/page changes
    useEffect(() => {
        const statusFromUrl = searchParams.get("status");
        if (statusFromUrl) {
            setActiveTab(statusFromUrl.toLowerCase());
        }

        fetchBookings();
    }, [activeTab, sortField, sortDirection, page]);

    // Update filtered bookings when search changes
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBookings(bookings);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = bookings.filter(booking =>
                booking.user.firstName.toLowerCase().includes(query) ||
                booking.user.lastName.toLowerCase().includes(query) ||
                booking.service.title.toLowerCase().includes(query) ||
                booking.id.toString().includes(query)
            );
            setFilteredBookings(filtered);
        }
    }, [searchQuery, bookings]);

    // Update URL when tab changes
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("status", activeTab);
        router.push(`?${newParams.toString()}`, { scroll: false });
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            // Build query params
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', pageSize.toString());
            params.append('sort', `${sortField},${sortDirection}`);

            if (activeTab !== 'all') {
                // Map tab name to BookingStatus
                const statusMap: { [key: string]: BookingStatus | any } = {
                    'pending': BookingStatus.PENDING,
                    'confirmed': BookingStatus.CONFIRMED,
                    'completed': BookingStatus.COMPLETED,
                    'cancelled': `${BookingStatus.CANCELLED_BY_USER},${BookingStatus.CANCELLED_BY_PROVIDER}`,
                    'noshow': BookingStatus.NO_SHOW
                };

                if (statusMap[activeTab]) {
                    params.append('status', statusMap[activeTab]);
                }
            }

            // Fetch bookings from provider endpoint
            const response = await api.get(`/bookings/provider?${params}`);

            setBookings(response.data.content);
            setFilteredBookings(response.data.content);
            setTotalPages(response.data.totalPages);

            // Fetch dashboard stats
            await fetchBookingStats();
        } catch (err: any) {
            console.error("Error fetching bookings:", err);
            setError(err.response?.data?.message || "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingStats = async () => {
        try {
            const response = await api.get('/bookings/provider/stats');
            setStats(response.data);
        } catch (err: any) {
            console.error("Error fetching booking stats:", err);
            // Don't show error for stats, just log it
        }
    };

    const updateBookingStatus = async (bookingId: number, status: BookingStatus, reason?: string) => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, {}, {
                params: {
                    status,
                    cancellationReason: reason
                }
            });

            // Show success message
            setSuccess(`Booking ${status === BookingStatus.CONFIRMED ? 'confirmed' :
                status === BookingStatus.COMPLETED ? 'marked as completed' :
                    status === BookingStatus.CANCELLED_BY_PROVIDER ? 'cancelled' :
                        status === BookingStatus.NO_SHOW ? 'marked as no-show' : 'updated'
                } successfully`);

            // Refresh bookings
            fetchBookings();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error("Error updating booking status:", err);
            setError(err.response?.data?.message || "Failed to update booking");
        }
    };

    const handleConfirmBooking = (bookingId: number) => {
        updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
    };

    const handleCompleteBooking = (bookingId: number) => {
        updateBookingStatus(bookingId, BookingStatus.COMPLETED);
    };

    const handleCancelBooking = (bookingId: number) => {
        const reason = prompt("Please provide a reason for cancellation:");
        if (reason) {
            updateBookingStatus(bookingId, BookingStatus.CANCELLED_BY_PROVIDER, reason);
        }
    };

    const handleNoShowBooking = (bookingId: number) => {
        updateBookingStatus(bookingId, BookingStatus.NO_SHOW);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            // Toggle direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // New field, default to descending
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled in useEffect
    };

    const getServiceIcon = (type: ServiceType) => {
        switch (type) {
            case ServiceType.ACCOMMODATION:
                return "🏠";
            case ServiceType.TRANSPORTATION:
                return "🚗";
            case ServiceType.TOUR_GUIDE:
                return "🧭";
            case ServiceType.ACTIVITY:
                return "🎭";
            case ServiceType.FOOD_EXPERIENCE:
                return "🍽️";
            //   case ServiceType.EQUIPMENT:
            //     return "🧰";
            default:
                return "📦";
        }
    };

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case BookingStatus.CONFIRMED:
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
            case BookingStatus.COMPLETED:
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
            case BookingStatus.CANCELLED_BY_USER:
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled by User</Badge>;
            case BookingStatus.CANCELLED_BY_PROVIDER:
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled by Provider</Badge>;
            case BookingStatus.NO_SHOW:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No Show</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const days = differenceInDays(end, start);

        if (days === 0) {
            return `${format(start, "MMM d, yyyy")} (${format(start, "h:mm a")} - ${format(end, "h:mm a")})`;
        } else {
            return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")} (${days} ${days === 1 ? 'day' : 'days'})`;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
                <p className="text-gray-600">View and manage bookings for your services</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Confirmed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-brand-600">${stats.revenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Success Message */}
            {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}

            {/* Error Message */}
            {error && (
                <Alert className="mb-6" variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabs and Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-1">
                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full bg-gray-100">
                            <TabsTrigger value="all" className="flex-1">All Bookings</TabsTrigger>
                            <TabsTrigger value="pending" className="flex-1">
                                Pending
                                {stats.pending > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-yellow-500 rounded-full">
                                        {stats.pending}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="confirmed" className="flex-1">Confirmed</TabsTrigger>
                            <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                            <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
                        </TabsList>

                        {/* Search and Filter Bar */}
                        <div className="p-4 border-t border-gray-200">
                            <form onSubmit={handleSearch} className="flex items-center">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                        placeholder="Search by guest name or service..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="ml-4">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </form>
                        </div>

                        {/* Table Header */}
                        <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 border-t border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort("id")}
                            >
                                Booking ID
                                {sortField === "id" && (
                                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                            </div>
                            <div className="col-span-2">Service</div>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort("startDateTime")}
                            >
                                Dates
                                {sortField === "startDateTime" && (
                                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                            </div>
                            <div>Guest</div>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort("totalPrice")}
                            >
                                Price
                                {sortField === "totalPrice" && (
                                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                            </div>
                            <div className="text-right">Actions</div>
                        </div>

                        <TabsContent value="all" className="mt-0">
                            {renderBookingsList()}
                        </TabsContent>

                        <TabsContent value="pending" className="mt-0">
                            {renderBookingsList()}
                        </TabsContent>

                        <TabsContent value="confirmed" className="mt-0">
                            {renderBookingsList()}
                        </TabsContent>

                        <TabsContent value="completed" className="mt-0">
                            {renderBookingsList()}
                        </TabsContent>

                        <TabsContent value="cancelled" className="mt-0">
                            {renderBookingsList()}
                        </TabsContent>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, stats.total)} of {stats.total} bookings
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page === totalPages - 1}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Tabs>
                </div>
            </div>

            {/* Upcoming Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Today's Schedule</h2>
                    <Link href="/dashboard/calendar">
                        <Button variant="outline">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            View Full Calendar
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                        </div>
                    ) : filteredBookings.filter(booking =>
                        booking.status === BookingStatus.CONFIRMED &&
                        new Date(booking.startDateTime).toDateString() === new Date().toDateString()
                    ).length > 0 ? (
                        filteredBookings
                            .filter(booking =>
                                booking.status === BookingStatus.CONFIRMED &&
                                new Date(booking.startDateTime).toDateString() === new Date().toDateString()
                            )
                            .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
                            .map(booking => (
                                <div key={`today-${booking.id}`} className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div className="flex items-center">
                                        <div className="bg-brand-50 p-2 rounded-full mr-3">
                                            <Clock className="h-5 w-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{format(parseISO(booking.startDateTime), "h:mm a")}</p>
                                            <p className="text-sm text-gray-500">{booking.service.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-sm text-gray-600 mr-4">
                                            {booking.user.firstName} {booking.user.lastName}
                                        </div>
                                        <Link href={`/bookings/${booking.id}`}>
                                            <Button size="sm" variant="outline">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <CalendarClock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No bookings scheduled for today</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    function renderBookingsList() {
        if (loading) {
            return (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                </div>
            );
        }

        if (filteredBookings.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500">No bookings found</p>
                </div>
            );
        }

        return (
            <div className="divide-y divide-gray-200">
                {filteredBookings.map(booking => (
                    <div key={booking.id} className="py-4 px-4">
                        {/* Mobile view */}
                        <div className="md:hidden space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium">{booking.service.title}</div>
                                    <div className="text-sm text-gray-500">#{booking.id.toString().padStart(6, '0')}</div>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>

                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{formatDateRange(booking.startDateTime, booking.endDateTime)}</span>
                            </div>

                            <div className="flex items-center text-sm">
                                <User className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{booking.user.firstName} {booking.user.lastName}</span>
                            </div>

                            <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <Link href={`/bookings/${booking.id}`}>
                                    <Button size="sm" variant="outline">View Details</Button>
                                </Link>
                                {renderActionButtons(booking)}
                            </div>
                        </div>

                        {/* Desktop view */}
                        <div className="hidden md:grid md:grid-cols-7 gap-4 items-center">
                            <div className="text-gray-500">#{booking.id.toString().padStart(6, '0')}</div>
                            <div className="col-span-2">
                                <div className="flex items-center">
                                    <span className="mr-2 text-xl">{getServiceIcon(booking.service.type)}</span>
                                    <div>
                                        <div className="font-medium">{booking.service.title}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {booking.service.location?.city}, {booking.service.location?.country}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm">{formatDateRange(booking.startDateTime, booking.endDateTime)}</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                                        <Image
                                            src={booking.user.profileImage || "/images/avatar.jpg"}
                                            alt={`${booking.user.firstName} ${booking.user.lastName}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span>{booking.user.firstName} {booking.user.lastName}</span>
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
                                <div className="text-xs text-gray-500">
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Link href={`/bookings/${booking.id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                                {renderActionButtons(booking)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderActionButtons(booking: any) {
        switch (booking.status) {
            case BookingStatus.PENDING:
                return (
                    <Button
                        size="sm"
                        onClick={() => handleConfirmBooking(booking.id)}
                    >
                        Confirm
                    </Button>
                );
            case BookingStatus.CONFIRMED:
                return (
                    <>
                        {new Date(booking.endDateTime) < new Date() && (
                            <Button
                                size="sm"
                                onClick={() => handleCompleteBooking(booking.id)}
                            >
                                Complete
                            </Button>
                        )}
                        {new Date(booking.startDateTime) < new Date() && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-yellow-600 hover:bg-yellow-50 hover:border-yellow-200"
                                onClick={() => handleNoShowBooking(booking.id)}
                            >
                                No-show
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 hover:border-red-200"
                            onClick={() => handleCancelBooking(booking.id)}
                        >
                            Cancel
                        </Button>
                    </>
                );
            default:
                return null;
        }
    }
}