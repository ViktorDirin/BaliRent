import { prisma } from "@/lib/prisma";
import { Calendar, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import BookingActions from "@/components/BookingActions";

export const dynamic = "force-dynamic";

async function getBookings() {
    // ... existing getBookings function
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                apartment: true, // Include apartment details
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return bookings;
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return [];
    }
}

export default async function AdminBookingsPage() {
    const bookings = await getBookings();

    return (
        <div>
            {/* ... Header ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Bookings</h1>
                    <p className="text-muted-foreground">Manage your property reservations</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm">Filter</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Apartment</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Guest</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Dates</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Total</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Status</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">{booking.apartment.title}</div>
                                            <div className="text-xs text-muted-foreground">{booking.apartment.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">{booking.guestName}</div>
                                            <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium font-serif">${booking.totalPrice.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${booking.status === 'confirmed'
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
                                                : booking.status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900'
                                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
                                                }`}>
                                                {booking.status === 'confirmed' && <CheckCircle className="h-3 w-3" />}
                                                {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                                                {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                                <span className="capitalize">{booking.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <BookingActions id={booking.id} status={booking.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
