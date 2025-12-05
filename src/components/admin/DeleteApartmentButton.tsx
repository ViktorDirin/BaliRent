"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteApartmentButtonProps {
    apartmentId: string;
    onDeletionSuccess?: () => void;
}

export default function DeleteApartmentButton({ apartmentId, onDeletionSuccess }: DeleteApartmentButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this apartment? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/apartments/${apartmentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete apartment");
            }

            if (onDeletionSuccess) {
                onDeletionSuccess();
            } else {
                // Default behavior: refresh the page to show updated list
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting apartment:", error);
            alert("Failed to delete apartment. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Apartment"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
