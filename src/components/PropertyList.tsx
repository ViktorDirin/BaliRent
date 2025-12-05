"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/data/properties";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

interface PropertyListProps {
  initialProperties: Property[];
}

export default function PropertyList({ initialProperties }: PropertyListProps) {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);

  const sortedProperties = [...initialProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.pricePerNight - b.pricePerNight;
      case "price-desc":
        return b.pricePerNight - a.pricePerNight;
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
