import { prisma } from "@/lib/prisma";
import { Calendar, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import BookingActions from "@/components/BookingActions";

export const dynamic = "force-dynamic";

async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: { apartment: true },
            orderBy: { createdAt: "desc" },
        });
        return bookings;
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return [];
    }
}

function StatusBadge({ status }: { status: string }) {
    const styles =
        status === "confirmed"
            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
            : status === "pending"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
        >
            {status === "confirmed" && <CheckCircle className="h-3 w-3" />}
            {status === "pending" && <Clock className="h-3 w-3" />}
            {status === "cancelled" && <XCircle className="h-3 w-3" />}
            <span className="capitalize">{status}</span>
        </span>
    );
}

export default async function AdminBookingsPage() {
    const bookings = await getBookings();

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">
                        Bookings
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage your property reservations</p>
                </div>

                {/* Search + Filter bar – wraps nicely on mobile */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm">Filter</span>
                    </button>
                </div>
            </div>

            {/* ── MOBILE CARD VIEW (< md) ── */}
            <div className="md:hidden space-y-3">
                {bookings.length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground text-sm">No bookings found.</p>
                ) : (
                    bookings.map((booking) => {
                        const nights = Math.ceil(
                            (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        return (
                            <div
                                key={booking.id}
                                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 space-y-3"
                            >
                                {/* Apartment + status row */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-neutral-900 dark:text-white truncate">
                                            {booking.apartment.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {booking.apartment.location}
                                        </p>
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </div>

                                {/* Guest info */}
                                <div className="text-sm">
                                    <p className="font-medium text-neutral-900 dark:text-white">
                                        {booking.guestName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
                                </div>

                                {/* Dates + total row */}
                                <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>
                                            {new Date(booking.startDate).toLocaleDateString()} –{" "}
                                            {new Date(booking.endDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-muted-foreground">({nights}n)</span>
                                    </div>
                                    <span className="font-medium font-serif text-neutral-900 dark:text-white">
                                        ${booking.totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end pt-1 border-t border-neutral-100 dark:border-neutral-800">
                                    <BookingActions id={booking.id} status={booking.status} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── DESKTOP TABLE VIEW (≥ md) ── */}
            <div className="hidden md:block bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                    Apartment
                                </th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                    Guest
                                </th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                    Dates
                                </th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                    Total
                                </th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white text-right">
                                    Actions
                                </th>
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
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {booking.apartment.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {booking.apartment.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {booking.guestName}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {booking.guestEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                                                        {new Date(booking.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {Math.ceil(
                                                        (new Date(booking.endDate).getTime() -
                                                            new Date(booking.startDate).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                    )}{" "}
                                                    nights
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium font-serif">
                                                ${booking.totalPrice.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
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
