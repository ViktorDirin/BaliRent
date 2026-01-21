import { prisma } from "@/lib/prisma";
import { Bed, Bath, Waves, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

async function getApartments() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return apartments;
    } catch (error) {
        console.error("Failed to fetch apartments:", error);
        return [];
    }
}

export default async function OurApartmentsPage() {
    const apartments = await getApartments();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header Section */}
            <div className="bg-white border-b border-black/5 py-24 md:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Our Collection
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl font-light">
                        Discover our hand-picked selection of luxury villas and apartments in Bali&apos;s most desirable locations.
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {apartments.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No properties available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {apartments.map((apartment) => {
                            // Parse images safely
                            let displayImage = null;
                            try {
                                if (apartment.images) {
                                    const parsed = JSON.parse(apartment.images);
                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                        displayImage = parsed[0];
                                    } else if (typeof apartment.images === 'string' && apartment.images.startsWith('http')) {
                                        displayImage = apartment.images;
                                    }
                                }
                            } catch (e) {
                                if (apartment.images && apartment.images.startsWith('http')) {
                                    displayImage = apartment.images;
                                }
                            }

                            const hasImage = !!displayImage;
                            // High-quality dark interior placeholder
                            const bgImage = displayImage || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop";


                            return (
                                <Link
                                    href={`/apartments/${apartment.slug}`}
                                    key={apartment.id}
                                    className="group block bg-white rounded-xl overflow-hidden border border-black/5 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                        <img
                                            src={bgImage}
                                            alt={apartment.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hasImage ? 'opacity-40 grayscale' : ''}`}
                                        />

                                        {!hasImage && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white/40 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                                                    <span className="text-foreground/80 font-serif tracking-wide text-sm">Photo Coming Soon</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Price Tag */}
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 shadow-sm">
                                            <span className="text-foreground font-semibold">
                                                ${apartment.pricePerNight}
                                                <span className="text-muted-foreground text-sm font-normal"> / night</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm mb-3">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="uppercase tracking-wider font-medium text-primary">{apartment.city || "Bali"}</span>
                                        </div>

                                        <h3 className="text-xl font-serif text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                                            {apartment.title}
                                        </h3>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-3 gap-4 border-t border-black/5 pt-4 mb-6">
                                            <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/50">
                                                <Bed className="w-5 h-5 text-muted-foreground mb-1" />
                                                <span className="text-xs text-muted-foreground">{apartment.bedrooms} Beds</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/50">
                                                <Bath className="w-5 h-5 text-muted-foreground mb-1" />
                                                <span className="text-xs text-muted-foreground">{apartment.bathrooms} Baths</span>
                                            </div>
                                            {apartment.hasPool ? (
                                                <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/50">
                                                    <Waves className="w-5 h-5 text-cyan-600 mb-1" />
                                                    <span className="text-xs text-muted-foreground">Pool</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/50">
                                                    <span className="text-muted-foreground">-</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="inline-flex items-center text-sm font-medium text-foreground group-hover:underline decoration-primary underline-offset-4">
                                            View Properties <ArrowRight className="ml-2 w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
