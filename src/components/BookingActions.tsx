"use client";

import { updateBookingStatus } from "@/lib/actions";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function BookingActions({ id, status }: { id: string, status: string }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await updateBookingStatus(id, newStatus);
        } catch (error) {
            console.error(error);
            alert("Failed to update booking status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            {status === 'pending' && (
                <>
                    <button
                        onClick={() => handleUpdate('confirmed')}
                        disabled={isUpdating}
                        className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-800"
                        title="Confirm Booking"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleUpdate('cancelled')}
                        disabled={isUpdating}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                        title="Cancel Booking"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </>
            )}
            {status === 'confirmed' && (
                <button
                    onClick={() => handleUpdate('cancelled')}
                    disabled={isUpdating}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                    title="Cancel Booking"
                >
                    <span className="text-xs font-medium px-2">Cancel</span>
                </button>
            )}
        </div>
    );
}
