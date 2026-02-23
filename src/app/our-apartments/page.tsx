import { prisma } from "@/lib/prisma";
import { getAvailableApartments } from "@/lib/actions";
import { CalendarSearch } from "lucide-react";
import Link from "next/link";
import ApartmentFilters, { ApartmentItem } from "@/components/ApartmentFilters";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

async function getApartments(): Promise<ApartmentItem[]> {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                slug: true,
                title: true,
                city: true,
                pricePerNight: true,
                bedrooms: true,
                bathrooms: true,
                hasPool: true,
                images: true,
            },
        });
        return apartments;
    } catch (error) {
        console.error("Failed to fetch apartments:", error);
        return [];
    }
}

export default async function OurApartmentsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const from = typeof params.from === "string" ? params.from : undefined;
    const to = typeof params.to === "string" ? params.to : undefined;
    const guests =
        typeof params.guests === "string" ? parseInt(params.guests) : 0;

    let apartments: ApartmentItem[] = [];
    let isFiltered = false;

    if (from && to) {
        const startDate = new Date(from);
        const endDate = new Date(to);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            // getAvailableApartments returns full Apartment objects — cast select fields
            const available = await getAvailableApartments(startDate, endDate, guests);
            apartments = available.map((a) => ({
                id: a.id,
                slug: a.slug,
                title: a.title,
                city: a.city,
                pricePerNight: a.pricePerNight,
                bedrooms: a.bedrooms,
                bathrooms: a.bathrooms,
                hasPool: a.hasPool,
                images: a.images,
            }));
            isFiltered = true;
        } else {
            apartments = await getApartments();
        }
    } else {
        apartments = await getApartments();
    }

    // Derive unique, sorted city list for the location dropdown
    const cities = Array.from(
        new Set(
            apartments
                .map((a) => a.city)
                .filter((c): c is string => !!c && c.trim() !== "")
        )
    ).sort();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* ── Hero Header ──────────────────────────────────────────────────── */}
            <div
                className="border-b py-20 md:py-28 px-4 sm:px-6 lg:px-8"
                style={{
                    background: "#fff",
                    borderColor: "rgba(0,0,0,0.06)",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <p
                        className="text-xs uppercase tracking-widest font-semibold mb-3"
                        style={{ color: "#C5A059" }}
                    >
                        Bali · Luxury Rentals
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Our Collection
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl font-light">
                        Discover our hand-picked selection of luxury villas and apartments
                        in Bali&apos;s most desirable locations.
                    </p>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Date-filter notice (from HomeSearch / URL params) */}
                {isFiltered && (
                    <div
                        className="mb-8 p-4 rounded-xl flex items-center gap-3"
                        style={{
                            background: "rgba(197,160,89,0.07)",
                            border: "1px solid rgba(197,160,89,0.2)",
                        }}
                    >
                        <CalendarSearch className="w-5 h-5 flex-shrink-0" style={{ color: "#C5A059" }} />
                        <p className="text-foreground font-medium text-sm">
                            Showing available properties from{" "}
                            <span className="font-bold">{from}</span> to{" "}
                            <span className="font-bold">{to}</span>
                            {guests > 0 && (
                                <span> for {guests} guest{guests !== 1 ? "s" : ""}</span>
                            )}
                        </p>
                        <Link
                            href="/our-apartments"
                            className="ml-auto text-sm font-medium whitespace-nowrap underline underline-offset-2"
                            style={{ color: "#C5A059" }}
                        >
                            Clear dates
                        </Link>
                    </div>
                )}

                {/* Client-side filter bar + grid */}
                <ApartmentFilters apartments={apartments} cities={cities} />

            </main>
        </div>
    );
}
