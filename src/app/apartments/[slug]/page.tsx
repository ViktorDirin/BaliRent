import BookingForm from "@/components/BookingForm";
import ImageGallery from "@/components/ImageGallery";
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
  Users,
} from "lucide-react";
import { getSettings, getBookedDates } from "@/lib/actions";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

async function getApartment(slug: string) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: { slug },
    });
    return apartment;
  } catch (error) {
    console.error("Failed to fetch apartment:", error);
    return null;
  }
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  const settings = await getSettings();
  const bookedDatesRaw = apartment ? await getBookedDates(apartment.id) : [];
  const bookedDates = bookedDatesRaw.map((d) => d.toISOString());

  const cleaningFee =
    typeof settings.cleaningFee === "number"
      ? settings.cleaningFee
      : apartment?.cleaningFee || 0;

  if (!apartment) {
    notFound();
  }

  // Parse images safely
  let images: string[] = [];
  try {
    images = apartment.images ? JSON.parse(apartment.images) : [];
  } catch {
    if (apartment.images && apartment.images.trim().startsWith("http")) {
      images = [apartment.images];
    }
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(apartment.pricePerNight);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ── Page Header (title + location) ──────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: "#C5A059" }} />
            <span
              className="text-sm uppercase tracking-widest font-medium"
              style={{ color: "#C5A059" }}
            >
              {apartment.city || "Bali"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold leading-tight">
              {apartment.title}
            </h1>
            <div
              className="shrink-0 px-5 py-3 rounded-xl border shadow-sm"
              style={{
                background: "rgba(197,160,89,0.06)",
                borderColor: "rgba(197,160,89,0.25)",
              }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                Starting from
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formattedPrice}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / night
                </span>
              </p>
            </div>
          </div>
          {apartment.address && (
            <p className="text-muted-foreground mt-2">{apartment.address}</p>
          )}
        </div>

        {/* ── Image Gallery ────────────────────────────────────────────── */}
        <div className="mb-10">
          <ImageGallery images={images} title={apartment.title} />
        </div>

        {/* ── Two-column layout: content left, booking right ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Stats, Description, Amenities */}
          <div className="lg:col-span-2 space-y-12">

            {/* Stats bar */}
            <div
              className="grid grid-cols-3 gap-4 p-6 rounded-xl border shadow-sm"
              style={{
                background: "#fff",
                borderColor: "rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Guests
                </span>
                <span className="text-xl font-semibold text-foreground">2</span>
              </div>
              <div
                className="flex flex-col items-center justify-center text-center border-l"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <Bed className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Bedrooms
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {apartment.bedrooms}
                </span>
              </div>
              <div
                className="flex flex-col items-center justify-center text-center border-l"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <Bath className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Bathrooms
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {apartment.bathrooms}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif text-foreground mb-4">
                About this space
              </h2>
              <div className="prose prose-neutral prose-lg text-muted-foreground leading-relaxed font-light">
                <p>{apartment.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-serif text-foreground mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apartment.hasWifi && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                    style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <Wifi className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Fast Wifi</span>
                  </div>
                )}
                {apartment.hasPool && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                    style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <Waves className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Private Pool</span>
                  </div>
                )}
                {apartment.hasAirCon && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                    style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <Wind className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Air Conditioning</span>
                  </div>
                )}
                {apartment.hasKitchen && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                    style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <Utensils className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Full Kitchen</span>
                  </div>
                )}
                {apartment.hasWasher && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                    style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Washer / Laundry</span>
                  </div>
                )}
                <div
                  className="flex items-center gap-3 p-4 rounded-lg border shadow-sm"
                  style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Premium Linens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              apartmentId={apartment.id}
              pricePerNight={apartment.pricePerNight}
              cleaningFee={cleaningFee}
              bookedDates={bookedDates}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
