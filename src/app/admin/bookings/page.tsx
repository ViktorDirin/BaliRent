import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: string;
    status: string;
    customerName: string | null;
    apartment: {
        title: string;
    };
}

async function getBookings() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/bookings`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch bookings");
        }

        return res.json();
    } catch (error) {
        console.error("Error loading bookings:", error);
        return [];
    }
}

export default async function BookingsPage() {
    const bookings: Booking[] = await getBookings();

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount: string) => {
        const num = parseFloat(amount);
        return isNaN(num) ? amount : `$${num.toFixed(2)}`;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Bookings</h1>
                    <p className="text-muted-foreground">Manage reservations and availability</p>
                </div>
                {/* 
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="h-5 w-5" />
                    New Booking
                </button> 
                */}
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 p-12 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-6">Bookings will appear here when customers make reservations</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Apartment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-in</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-out</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-foreground">{booking.customerName || "Guest"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-foreground">{booking.apartment?.title || "Unknown Property"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {formatDate(booking.startDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {formatDate(booking.endDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                                            {formatCurrency(booking.totalPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                                ${booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                                                ${!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(booking.status) ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' : ''}
                                            `}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button className="text-muted-foreground hover:text-foreground transition-colors" title="Manage Booking">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
