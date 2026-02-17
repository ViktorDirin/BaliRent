import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/apartments - Get all apartments
export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: "desc" },
        });

        const formattedApartments = apartments.map(apt => {
            // Используем 'any', чтобы TypeScript не ругался на отсутствие полей в схеме
            const apartmentData = apt as any;

            let parsedImages = [];
            try {
                parsedImages = apartmentData.images ? JSON.parse(apartmentData.images) : [];
            } catch (e) {
                if (apartmentData.images && apartmentData.images.trim().startsWith('http')) {
                    parsedImages = [apartmentData.images];
                }
            }

            let parsedAmenities = [];
            try {
                parsedAmenities = apartmentData.amenities ? JSON.parse(apartmentData.amenities) : [];
            } catch (e) {
                // ignore error
            }

            return {
                ...apartmentData,
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
                // Записываем amenities, даже если их нет в схеме, через any-хак
                ...({ amenities: JSON.stringify(amenities || []) } as any)
            } as any, // Принудительно разрешаем создание, если поля расходятся со схемой
        });

        const createdApartment = apartment as any;

        return NextResponse.json({
            ...createdApartment,
            images: createdApartment.images ? JSON.parse(createdApartment.images) : [],
            amenities: createdApartment.amenities ? JSON.parse(createdApartment.amenities) : [],
        }, { status: 201 });
    } catch (error) {
        console.error("DEBUG_POST_ERROR:", error);
        return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
    }
}