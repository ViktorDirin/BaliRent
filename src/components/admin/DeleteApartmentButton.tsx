"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteApartmentButtonProps {
    apartmentId: string;
    onDeletionSuccess?: () => void;
}

export default function DeleteApartmentButton({ apartmentId, onDeletionSuccess }: DeleteApartmentButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/apartments/${apartmentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete apartment");
            }

            // Close modal on success
            setIsModalOpen(false);

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
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Apartment"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200 relative">

                        <button
                            onClick={() => !isDeleting && setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            disabled={isDeleting}
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">Delete Apartment?</h3>
                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete this apartment? This action cannot be undone and will permanently remove the listing.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
