import React from 'react';
import Link from 'next/link';
import { Property } from '@/data/properties';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link href={`/properties/${property.id}`} className="group block">
            <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image Placeholder */}
                <div className="w-full aspect-square bg-muted flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <span className="text-muted-foreground text-sm font-medium">Image Placeholder</span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                        {property.title}
                    </h3>
                    <p className="text-muted-foreground text-sm truncate">
                        {property.location}
                    </p>
                    <div className="pt-2 flex items-baseline gap-1">
                        <span className="font-bold text-foreground">${property.pricePerNight}</span>
                        <span className="text-muted-foreground text-sm">/ night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
