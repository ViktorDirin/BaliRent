import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  MapPin,
  Wifi,
  Wind,
  Utensils,
  Waves,
  Bed,
  Bath,
  CheckCircle,
  Users
} from "lucide-react";
import { getSettings } from "@/lib/actions";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

async function getApartment(slug: string) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: {
        slug: slug,
      },
    });
    return apartment;
  } catch (error) {
    console.error("Failed to fetch apartment:", error);
    return null;
  }
}

export default async function ApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  const settings = await getSettings();
  // ... existing code ...

  // Use dynamic cleaning fee if set in settings, otherwise fallback to apartment's fee or 0
  const cleaningFee = typeof settings.cleaningFee === 'number' ? settings.cleaningFee : (apartment?.cleaningFee || 0);

  if (!apartment) {
    notFound();
  }

  // Parse images safely
  let images: string[] = [];
  try {
    images = apartment.images ? JSON.parse(apartment.images) : [];
  } catch (e) {
    if (apartment.images && apartment.images.trim().startsWith('http')) {
      images = [apartment.images];
    }
  }

  if (images.length === 0) images = ["/placeholder.jpg"];

  // Parse price formatting
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(apartment.pricePerNight);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={images[0]}
          alt={apartment.title}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-400 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span className="uppercase tracking-wider font-medium text-amber-500">{apartment.city || "Bali"}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-2">
                {apartment.title}
              </h1>
              {apartment.address && (
                <p className="text-neutral-300 text-lg">{apartment.address}</p>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
              <p className="text-neutral-200 text-sm uppercase tracking-wide">Starting from</p>
              <p className="text-3xl font-bold text-white">{formattedPrice} <span className="text-base font-normal text-neutral-300">/ night</span></p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* ... Stats, Description, Amenities, Gallery ... */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-sm text-neutral-400 uppercase tracking-wider mb-1">Guests</span>
                <span className="text-xl font-semibold text-white">2</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-neutral-800">
                <Bed className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-sm text-neutral-400 uppercase tracking-wider mb-1">Bedrooms</span>
                <span className="text-xl font-semibold text-white">{apartment.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-neutral-800">
                <Bath className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-sm text-neutral-400 uppercase tracking-wider mb-1">Bathrooms</span>
                <span className="text-xl font-semibold text-white">{apartment.bathrooms}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif text-white mb-4">About this space</h2>
              <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed font-light">
                <p>{apartment.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-serif text-white mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apartment.hasWifi && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <Wifi className="w-5 h-5 text-amber-500" />
                    <span className="text-neutral-200">Fast Wifi</span>
                  </div>
                )}
                {apartment.hasPool && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <Waves className="w-5 h-5 text-amber-500" />
                    <span className="text-neutral-200">Private Pool</span>
                  </div>
                )}
                {apartment.hasAirCon && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <Wind className="w-5 h-5 text-amber-500" />
                    <span className="text-neutral-200">Air Conditioning</span>
                  </div>
                )}
                {apartment.hasKitchen && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <Utensils className="w-5 h-5 text-amber-500" />
                    <span className="text-neutral-200">Full Kitchen</span>
                  </div>
                )}
                {apartment.hasWasher && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-neutral-200">Washer / Laundry</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-neutral-200">Premium Linens</span>
                </div>
              </div>
            </div>

            {/* Image Gallery Grid (if more images) */}
            {images.length > 1 && (
              <div>
                <h2 className="text-2xl font-serif text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-video relative rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              apartmentId={apartment.id}
              pricePerNight={apartment.pricePerNight}
              cleaningFee={cleaningFee}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
