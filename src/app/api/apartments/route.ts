import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/apartments - Get all apartments
export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: "desc" },
        });

        const formattedApartments = apartments.map(apt => {
            let parsedImages = [];
            try {
                parsedImages = apt.images ? JSON.parse(apt.images) : [];
            } catch (e) {
                if (apt.images && apt.images.trim().startsWith('http')) {
                    parsedImages = [apt.images];
                }
            }

            let parsedAmenities = [];
            try {
                parsedAmenities = apt.amenities ? JSON.parse(apt.amenities) : [];
            } catch (e) {
                // ignore error
            }

            return {
                ...apt,
                images: parsedImages,
                amenities: parsedAmenities,
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
        const { title, description, location, pricePerNight, slug, images, amenities, serviceFee } = body;

        const apartment = await prisma.apartment.create({
            data: {
                title,
                description,
                location,
                pricePerNight: parseFloat(String(pricePerNight)),
                serviceFee: parseFloat(String(serviceFee || 0)),
                slug,
                images: JSON.stringify(images || []),
                amenities: JSON.stringify(amenities || []),
            },
        });

        return NextResponse.json({
            ...apartment,
            images: JSON.parse(apartment.images),
            amenities: apartment.amenities ? JSON.parse(apartment.amenities) : [],
        }, { status: 201 });
    } catch (error) {
        console.error("DEBUG_POST_ERROR:", error);
        return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
    }
}
