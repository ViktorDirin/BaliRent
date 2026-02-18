import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apartmentSchema } from "@/lib/validations";

export const dynamic = 'force-dynamic';

// GET /api/apartments - Get all apartments
export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: "desc" },
        });

        const formattedApartments = apartments.map(apt => {
            const apartmentData = apt as any;

            let parsedImages = [];
            try {
                parsedImages = apartmentData.images ? JSON.parse(apartmentData.images) : [];
            } catch (e) {
                if (apartmentData.images && apartmentData.images.trim().startsWith('http')) {
                    parsedImages = [apartmentData.images];
                }
            }

            // Amenities are boolean flags in DB, but we might want to return them as an object/array if client expects
            // But for now, just return what is in DB

            return {
                ...apartmentData,
                images: parsedImages,
                // Client might expect 'amenities' object/array if it was keying off that.
                // But the schema has specific flags. Let's construct a compatible view if needed.
                amenities: {
                    hasWifi: apt.hasWifi,
                    hasPool: apt.hasPool,
                    hasAirCon: apt.hasAirCon,
                    hasKitchen: apt.hasKitchen,
                    hasWasher: apt.hasWasher
                }
            };
        });

        return NextResponse.json(formattedApartments);
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
    }
}

// POST /api/apartments - Create a new apartment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Use Zod to validate and parse inputs
        // Note: Zod schema uses 'price', but we map it to 'pricePerNight'
        // We'll rename pricePerNight to price in body if needed before validation, or adjust.
        if (body.pricePerNight && !body.price) {
            body.price = body.pricePerNight;
        }

        const validation = apartmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const data = validation.data;

        const slug = body.slug || (data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now());

        // Handle images
        let imagesJson = "[]";
        if (body.images) {
            if (typeof body.images === 'string') {
                // Try to see if it's already JSON
                try {
                    JSON.parse(body.images);
                    imagesJson = body.images;
                } catch {
                    // Treat as single URL? or non-JSON string
                    imagesJson = JSON.stringify([body.images]);
                }
            } else if (Array.isArray(body.images)) {
                imagesJson = JSON.stringify(body.images);
            }
        }

        const apartment = await prisma.apartment.create({
            data: {
                title: data.title,
                description: data.description,
                location: data.location || "Bali",
                pricePerNight: data.price,
                slug: slug,
                images: imagesJson,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                hasAirCon: data.hasAirCon ?? false,
                hasWifi: data.hasWifi ?? true,
                hasKitchen: data.hasKitchen ?? false,
                hasPool: data.hasPool ?? false,
                hasWasher: data.hasWasher ?? false,
                city: data.city || "Canggu",
                // Remove serviceFee and any other non-schema fields
                cleaningFee: body.cleaningFee ? parseFloat(String(body.cleaningFee)) : 0,
            },
        });

        return NextResponse.json({
            ...apartment,
            images: apartment.images ? JSON.parse(apartment.images) : [],
        }, { status: 201 });
    } catch (error) {
        console.error("DEBUG_POST_ERROR:", error);
        return NextResponse.json({ error: "Failed to create apartment. Check server logs." }, { status: 500 });
    }
}