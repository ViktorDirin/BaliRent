"use client";

import React, { useEffect, useState } from 'react';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import { Property } from '@/data/properties';

interface PropertyDetailsPageProps {
    params: {
        propertyId: string;
    };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProperty() {
            try {
                const response = await fetch(`/api/apartments/${params.propertyId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Property not found");
                    } else {
                        setError("Failed to load property details");
                    }
                    return;
                }
                const data = await response.json();
                setProperty(data);
            } catch (err) {
                console.error(err);
                setError("An error occurred while loading the property");
            } finally {
                setLoading(false);
            }
        }

        if (params.propertyId) {
            fetchProperty();
        }
    }, [params.propertyId]);

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !property) {
        return (
            <main className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
                        <p className="text-xl text-muted-foreground">{error || "Property Not Found"}</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <ImageGallery images={property.images} />

                        {/* Property Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{property.title}</h1>
                                <p className="text-muted-foreground text-lg">{property.location}</p>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-bold mb-3">Description</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-muted-foreground">
                                    {property.amenities.map((amenity, index) => (
                                        <span key={index}>• {amenity}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingForm
                                pricePerNight={property.pricePerNight}
                                cleaningFee={(property as any).cleaningFee ?? 0}
                                bookedDates={[]}
                                apartmentId={property.id}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
