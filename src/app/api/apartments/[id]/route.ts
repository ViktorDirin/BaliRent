import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/apartments/[id] - Get a single apartment
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const apartment = await prisma.apartment.findUnique({
            where: { id },
        });

        if (!apartment) {
            return NextResponse.json(
                { error: "Apartment not found" },
                { status: 404 }
            );
        }

        // Parse images safely
        let parsedImages = [];
        try {
            parsedImages = apartment.images ? JSON.parse(apartment.images) : [];
        } catch (e) {
            // Check if it's a raw URL string
            if (apartment.images && apartment.images.trim().startsWith('http')) {
                parsedImages = [apartment.images];
            } else {
                parsedImages = [];
            }
        }

        // Parse amenities safely
        let parsedAmenities = [];
        try {
            parsedAmenities = (apartment as any).amenities ? JSON.parse((apartment as any).amenities) : [];
        } catch (e) {
            parsedAmenities = [];
        }

        return NextResponse.json({
            ...apartment,
            images: parsedImages,
            amenities: parsedAmenities,
        });
    } catch (error) {
        console.error("Error fetching apartment:", error);
        return NextResponse.json(
            { error: "Failed to fetch apartment" },
            { status: 500 }
        );
    }
}

// PUT /api/apartments/[id] - Update an apartment
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, location, pricePerNight, slug, images, amenities, serviceFee } = body;

        const apartment = await prisma.apartment.update({
            where: { id },
            data: {
                title,
                description,
                location,
                pricePerNight: pricePerNight ? Number(pricePerNight) : undefined,
                serviceFee: serviceFee ? Number(serviceFee) : undefined,
                slug,
                images: images ? JSON.stringify(images) : undefined,
                amenities: amenities ? JSON.stringify(amenities) : undefined,
            } as any,
        });

        // Parse images safely for response
        let parsedImages = [];
        try {
            parsedImages = apartment.images ? JSON.parse(apartment.images) : [];
        } catch (e) {
            if (apartment.images && apartment.images.trim().startsWith('http')) {
                parsedImages = [apartment.images];
            } else {
                parsedImages = [];
            }
        }

        return NextResponse.json({
            ...apartment,
            images: parsedImages,
            amenities: (apartment as any).amenities ? JSON.parse((apartment as any).amenities) : [],
        });
    } catch (error) {
        console.error("Error updating apartment:", error);
        return NextResponse.json(
            { error: "Failed to update apartment" },
            { status: 500 }
        );
    }
}

// DELETE /api/apartments/[id] - Delete an apartment
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.apartment.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Apartment deleted successfully" });
    } catch (error) {
        console.error("Error deleting apartment:", error);
        return NextResponse.json(
            { error: "Failed to delete apartment" },
            { status: 500 }
        );
    }
}
