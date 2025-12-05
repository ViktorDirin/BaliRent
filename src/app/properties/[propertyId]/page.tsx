"use client";

import React from 'react';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import { MOCK_PROPERTIES } from '@/data/properties';

interface PropertyDetailsPageProps {
    params: {
        propertyId: string;
    };
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
    // Find the property matching the ID from params
    const property = MOCK_PROPERTIES.find(p => p.id === params.propertyId);

    if (!property) {
        return (
            <main className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-4xl font-serif font-bold">404 Property Not Found</h1>
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
                                serviceFee={property.serviceFee}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
