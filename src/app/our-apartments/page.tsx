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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
            {/* Header Section */}
            <div className="bg-neutral-900 border-b border-neutral-800 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Our Collection
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl font-light">
                        Discover our hand-picked selection of luxury villas and apartments in Bali&apos;s most desirable locations.
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {apartments.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-lg">No properties available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {apartments.map((apartment) => {
                            // Parse images safely
                            let displayImage = "/placeholder.jpg";
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

                            return (
                                <Link
                                    href={`/apartments/${apartment.slug}`}
                                    key={apartment.id}
                                    className="group block bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                                        <img
                                            src={displayImage}
                                            alt={apartment.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Price Tag */}
                                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                            <span className="text-white font-semibold">
                                                ${apartment.pricePerNight}
                                                <span className="text-neutral-400 text-sm font-normal"> / night</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-primary-400 text-sm mb-3">
                                            <MapPin className="w-4 h-4" />
                                            <span className="uppercase tracking-wider font-medium text-amber-500">{apartment.city || "Bali"}</span>
                                        </div>

                                        <h3 className="text-xl font-serif text-white mb-4 line-clamp-1 group-hover:text-amber-500 transition-colors">
                                            {apartment.title}
                                        </h3>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-3 gap-4 border-t border-neutral-800 pt-4 mb-6">
                                            <div className="flex flex-col items-center justify-center p-2 rounded bg-neutral-950/50">
                                                <Bed className="w-5 h-5 text-neutral-400 mb-1" />
                                                <span className="text-xs text-neutral-500">{apartment.bedrooms} Beds</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 rounded bg-neutral-950/50">
                                                <Bath className="w-5 h-5 text-neutral-400 mb-1" />
                                                <span className="text-xs text-neutral-500">{apartment.bathrooms} Baths</span>
                                            </div>
                                            {apartment.hasPool ? (
                                                <div className="flex flex-col items-center justify-center p-2 rounded bg-neutral-950/50">
                                                    <Waves className="w-5 h-5 text-cyan-500 mb-1" />
                                                    <span className="text-xs text-neutral-500">Pool</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-2 rounded bg-neutral-950/50">
                                                    <span className="text-neutral-600">-</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="inline-flex items-center text-sm font-medium text-white group-hover:underline decoration-amber-500 underline-offset-4">
                                            View Properties <ArrowRight className="ml-2 w-4 h-4 text-amber-500" />
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
