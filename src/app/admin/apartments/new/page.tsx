"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewApartmentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [beds, setBeds] = useState("");
    const [guests, setGuests] = useState("");

    // Image state
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const handleAddImage = () => {
        if (imageUrlInput.trim()) {
            setImages([...images, imageUrlInput.trim()]);
            setImageUrlInput("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            const payload = {
                title,
                description,
                pricePerNight: Number(pricePerNight),
                beds: Number(beds),
                guests: Number(guests),
                images: images.map(url => ({ url })),
            };

            const response = await fetch("/api/admin/apartments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create apartment");
            }

            setSuccess(true);
            // Optional: clear form or redirect
            // setTitle("");
            // setDescription("");
            // setPricePerNight("");
            // setBeds("");
            // setGuests("");
            // setImages([]);

            // Redirect after short delay
            setTimeout(() => {
                router.push("/admin/apartments");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Link
                href="/admin/apartments"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Apartments
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Add New Apartment</h1>
                <p className="text-muted-foreground">Create a new property listing for your portfolio.</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6 border border-green-200 dark:border-green-800">
                    Apartment created successfully! Redirecting...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">General Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Property Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="e.g. Ocean View Villa"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="Describe the property..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Capacity Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Pricing & Capacity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price per Night ($)</label>
                            <input
                                type="number"
                                value={pricePerNight}
                                onChange={(e) => setPricePerNight(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Beds</label>
                            <input
                                type="number"
                                value={beds}
                                onChange={(e) => setBeds(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="1"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Guests</label>
                            <input
                                type="number"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="1"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Property Images</h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                            placeholder="Enter image URL (e.g. https://example.com/image.jpg)"
                        />
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {images.length > 0 ? (
                        <div className="space-y-2">
                            {images.map((url, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                    <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                                        <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                    </div>
                                    <span className="flex-1 text-sm truncate font-mono text-muted-foreground">{url}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No images added yet.</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Apartment"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
