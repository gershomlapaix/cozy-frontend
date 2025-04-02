"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    User, Home, Calendar, Star, Settings, LogOut,
    ChevronRight, Menu, X, Building, Car, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProvider, setIsProvider] = useState(false);

    const { user, logout } = useAuth();

    // This would normally come from an authentication context
    useEffect(() => {
        // Mock check if user is a provider
        const checkProvider = () => {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setIsProvider(user?.isProvider);
        };

        checkProvider();
    }, [isProvider]);

    const userNavLinks = [
        { name: "Profile", href: "/dashboard", icon: User },
        { name: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
        // { name: "Availability management", href: "/dashboard/availability", icon: Calendar },
        // { name: "Reviews", href: "/dashboard/reviews", icon: Star },
        // { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const providerNavLinks = [
        { name: "My Listings", href: "/dashboard/listings", icon: Building },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
        { name: "Bookings", href: "/dashboard/provider/bookings", icon: Calendar },
        // { name: "Availability management", href: "/dashboard/availability", icon: Calendar },
        // { name: "Reviews", href: "/dashboard/provider/reviews", icon: Star },
    ];

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={closeSidebar}></div>

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    <Link href="/" className="flex items-center">
                        <p className="bg-gray-700 border border-gray-500 py- rounded-md px-2 font-bold text-white text-6xl">C</p>
                        <span className="ml-2 text-xl font-bold text-brand-700">CozyStay</span>
                    </Link>
                    <button
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                        onClick={closeSidebar}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src="https://cdn.pixabay.com/photo/2023/06/23/11/23/ai-generated-8083323_1280.jpg"
                                alt="User"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs font-medium text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <div className="py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            User
                        </h3>
                        <div className="space-y-1">
                            {userNavLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                                        ? "bg-brand-50 text-brand-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${isActive(item.href) ? "text-brand-500" : "text-gray-400 group-hover:text-gray-500"
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {isProvider && (
                        <div className="py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Provider
                            </h3>
                            <div className="space-y-1">
                                {providerNavLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                                            ? "bg-brand-50 text-brand-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive(item.href) ? "text-brand-500" : "text-gray-400 group-hover:text-gray-500"
                                                }`}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 mt-4 border-t border-gray-200">
                        <button
                            onClick={logout}
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full">
                            <LogOut
                                className="mr-3 h-5 w-5 text-red-500"
                            />
                            Sign Out
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 lg:pl-64">
                {/* Top navigation */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center lg:hidden">
                            <button
                                type="button"
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 flex justify-end space-x-4">
                            <div className="flex items-center">
                                {isProvider ? (
                                    <Link href="/dashboard/listings/create">
                                        <Button>
                                            <span className="hidden md:inline-block mr-2">Add New Listing</span>
                                            <span className="md:hidden">Add</span>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/accommodations">
                                        <Button>Book Now</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}