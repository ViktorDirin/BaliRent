"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
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
    const [pricePerNight, setPricePerNight] = useState(initialData.pricePerNight || initialData.price || "");
    const [beds, setBeds] = useState(initialData.bedrooms || initialData.beds || "");
    const [location, setLocation] = useState(initialData.location || "");
    const [slug, setSlug] = useState(initialData.slug || "");

    // New fields
    const [address, setAddress] = useState(initialData.address || "");
    const [city, setCity] = useState(initialData.city || "Canggu");
    const [bathrooms, setBathrooms] = useState(initialData.bathrooms || "1");
    const [hasPool, setHasPool] = useState(initialData.hasPool || false);
    const [hasWasher, setHasWasher] = useState(initialData.hasWasher || false);
    const [checkInTime, setCheckInTime] = useState(initialData.checkInTime || "14:00");
    const [checkOutTime, setCheckOutTime] = useState(initialData.checkOutTime || "11:00");
    const [cleaningFee, setCleaningFee] = useState(initialData.cleaningFee || "0");

    // Image state
    const [imageUrlInput, setImageUrlInput] = useState("");
    // Image state initialization
    const [images, setImages] = useState<string[]>(() => {
        if (!initialData.images) return [];
        if (Array.isArray(initialData.images)) return initialData.images;
        try {
            return JSON.parse(initialData.images);
        } catch (e) {
            if (typeof initialData.images === 'string' && initialData.images.trim().startsWith('http')) {
                return [initialData.images];
            }
            return [];
        }
    });

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
                address,
                city,
                pricePerNight: Number(pricePerNight), // Send as number
                bedrooms: Number(beds),
                bathrooms: Number(bathrooms),
                hasPool,
                hasWasher,
                checkInTime,
                checkOutTime,
                cleaningFee: Number(cleaningFee),
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

                {/* Location Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location Label</label>
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
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="e.g. Canggu"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Full Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="e.g. Jl. Pantai Batu Bolong No. 88"
                            />
                        </div>
                    </div>
                </div>

                {/* Details & Amenities Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Details & Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Bathrooms</label>
                            <input
                                type="number"
                                value={bathrooms}
                                onChange={(e) => setBathrooms(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="1"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in Time</label>
                            <input
                                type="time"
                                value={checkInTime}
                                onChange={(e) => setCheckInTime(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out Time</label>
                            <input
                                type="time"
                                value={checkOutTime}
                                onChange={(e) => setCheckOutTime(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasPool}
                                onChange={(e) => setHasPool(e.target.checked)}
                                className="rounded border-neutral-300 text-primary focus:ring-primary h-5 w-5"
                            />
                            <span>Swimming Pool</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasWasher}
                                onChange={(e) => setHasWasher(e.target.checked)}
                                className="rounded border-neutral-300 text-primary focus:ring-primary h-5 w-5"
                            />
                            <span>Washing Machine</span>
                        </label>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <label className="block text-sm font-medium mb-1">Cleaning Fee ($)</label>
                            <input
                                type="number"
                                value={cleaningFee}
                                onChange={(e) => setCleaningFee(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                                placeholder="0"
                                min="0"
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
                                <div
                                    key={index}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', index.toString());
                                        e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                        const toIndex = index;

                                        if (fromIndex === toIndex) return;

                                        const newImages = [...images];
                                        const [movedItem] = newImages.splice(fromIndex, 1);
                                        newImages.splice(toIndex, 0, movedItem);
                                        setImages(newImages);
                                    }}
                                    className="group flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-colors cursor-move"
                                >
                                    <div className="text-neutral-400 cursor-grab active:cursor-grabbing p-1">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    <div className="relative h-16 w-24 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                                        <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                        {index === 0 && (
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] font-bold text-center py-1 backdrop-blur-sm">
                                                COVER
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate font-mono text-muted-foreground">{url}</p>
                                        {index === 0 && (
                                            <p className="text-xs text-primary font-medium mt-1">Main Preview Image</p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Remove image"
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
