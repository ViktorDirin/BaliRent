import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyList from '@/components/PropertyList';
import { Property } from '@/data/properties';

export default async function Home() {
  let properties: Property[] = [];
  let error = null;

  try {
    const response = await fetch('http://localhost:3000/api/apartments', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    properties = await response.json();
  } catch (e) {
    console.error("Error fetching properties:", e);
    error = "Failed to load properties. Please try again later.";
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Our Exclusive Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover our handpicked selection of luxury apartments and hotels.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <PropertyList initialProperties={properties} />
        )}
      </div>

      <Footer />
    </main>
  );
}
