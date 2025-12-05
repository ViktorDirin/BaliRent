"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface ApartmentEditFormProps {
    initialData: any;
}

export default function ApartmentEditForm({ initialData }: ApartmentEditFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form state initialized with data
    const [title, setTitle] = useState(initialData.title || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [pricePerNight, setPricePerNight] = useState(initialData.price || "");
    const [beds, setBeds] = useState(initialData.beds || ""); // Note: Schema doesn't have beds/guests explicitly shown in previous view but assuming they might exist or mapped to description/other fields. 
    // Wait, looking at schema provided earlier: 
    // model Apartment { id, title, description, location, price, images, slug, ... }
    // The 'new' page had beds/guests but schema didn't show them in the view_file of schema.prisma earlier.
    // I will stick to the schema fields I saw: title, description, location, price, slug, images.
    // I will add 'location' and 'slug' which were missing in the 'new' page snippet I saw or maybe I missed them.
    // Actually, let's look at the 'new' page again. It had pricePerNight, beds, guests.
    // But the schema I saw: title, description, location, price, images, slug.
    // I should probably map 'pricePerNight' to 'price'.
    // And I need 'location' and 'slug'.
    // I will add Location and Slug fields to the form as they are in the schema.

    const [location, setLocation] = useState(initialData.location || "");
    const [slug, setSlug] = useState(initialData.slug || "");

    // Image state
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [images, setImages] = useState<string[]>(
        initialData.images ? JSON.parse(initialData.images) : []
    );

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
                location,
                price: String(pricePerNight), // Schema says String
                slug,
                images,
            };

            const response = await fetch(`/api/apartments/${initialData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update apartment");
            }

            setSuccess(true);

            // Redirect after short delay
            setTimeout(() => {
                router.push("/admin/apartments");
                router.refresh();
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
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Edit Apartment</h1>
                <p className="text-muted-foreground">Update property details.</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6 border border-green-200 dark:border-green-800">
                    Apartment updated successfully! Redirecting...
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
                            <label className="block text-sm font-medium mb-1">Slug (URL Friendly)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="e.g. ocean-view-villa"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="e.g. Bali, Indonesia"
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

                {/* Pricing Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                Updating...
                            </>
                        ) : (
                            "Update Apartment"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
