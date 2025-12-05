"use client";

import React, { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    // Initialize state with the first image
    const [selectedImage, setSelectedImage] = useState(images[0]);

    // We display the first 4 images as thumbnails to allow navigation back to the first one
    const thumbnails = images.slice(0, 4);

    return (
        <div className="space-y-4">
            {/* Main Large Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={selectedImage}
                    alt="Property Main View"
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </div>

            {/* Thumbnails Grid */}
            {thumbnails.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                    {thumbnails.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`
                h-24 rounded-lg overflow-hidden cursor-pointer shadow-sm transition-all
                ${selectedImage === img ? 'ring-2 ring-offset-2 ring-primary opacity-100' : 'hover:opacity-80 opacity-70'}
              `}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`Property View ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
