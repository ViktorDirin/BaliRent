"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Bookings</h1>
                    <p className="text-muted-foreground">Manage reservations and availability</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="h-5 w-5" />
                    New Booking
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 p-12 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-6">Bookings will appear here when customers make reservations</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Villa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Bookings will be rendered here */}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
