import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Star } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getFeaturedProperties() {
  try {
    const apartments = await prisma.apartment.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return apartments;
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">


      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"
            alt="Bali Villa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" /> {/* Very subtle top gradient */}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up pt-20">
          <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm md:text-base animate-slide-up drop-shadow-sm">
            Welcome to Paradise
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight drop-shadow-lg filter shadow-black/20">
            Exquisite <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-100 drop-shadow-md">Bali Living</span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto drop-shadow-lg shadow-black/30">
            Discover our handpicked collection of luxury villas and apartments in the heart of Bali.
          </p>
          <div className="pt-8">
            <Link
              href="/our-apartments"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold text-lg rounded-full hover:bg-amber-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">Featured Properties</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience the ultimate in comfort and style with our most exclusive listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProperties.map((property) => {
            // Parse images safely
            let displayImage = null;
            try {
              if (property.images) {
                const parsed = JSON.parse(property.images);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  displayImage = parsed[0];
                } else if (typeof property.images === 'string' && property.images.startsWith('http')) {
                  displayImage = property.images;
                }
              }
            } catch (e) {
              if (property.images && property.images.startsWith('http')) {
                displayImage = property.images;
              }
            }

            const hasImage = !!displayImage;
            const bgImage = displayImage || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop";

            return (
              <Link
                href={`/apartments/${property.slug}`}
                key={property.id}
                className="group block bg-white rounded-xl overflow-hidden border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={bgImage}
                    alt={property.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!hasImage ? 'opacity-40 grayscale' : ''}`}
                  />

                  {!hasImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/40 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                        <span className="text-foreground/80 font-serif tracking-wide text-sm">Photo Coming Soon</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-black/5 shadow-sm">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-semibold text-foreground">5.0</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-primary text-xs font-bold tracking-wider uppercase mb-1">{property.city || "Bali"}</p>
                      <h3 className="text-xl font-serif text-foreground group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-black/5">
                    <div className="text-muted-foreground text-sm">
                      {property.bedrooms} Beds • {property.bathrooms} Baths
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-foreground">${property.pricePerNight}</span>
                      <span className="text-xs text-muted-foreground">per night</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/our-apartments" className="inline-block text-muted-foreground hover:text-primary underline decoration-primary underline-offset-4 transition-colors">
            View All Properties
          </Link>
        </div>
      </section>
    </div>

  );
}
