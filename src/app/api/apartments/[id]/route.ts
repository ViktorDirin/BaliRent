import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/apartments/[id] - Get a single apartment
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const apartment = await prisma.apartment.findUnique({
            where: { id: params.id },
        });

        if (!apartment) {
            return NextResponse.json(
                { error: "Apartment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(apartment);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch apartment" },
            { status: 500 }
        );
    }
}

// PUT /api/apartments/[id] - Update an apartment
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, description, location, price, slug, images } = body;

        const apartment = await prisma.apartment.update({
            where: { id: params.id },
            data: {
                title,
                description,
                location,
                price,
                slug,
                images: images ? JSON.stringify(images) : undefined,
            },
        });

        return NextResponse.json(apartment);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update apartment" },
            { status: 500 }
        );
    }
}

// DELETE /api/apartments/[id] - Delete an apartment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.apartment.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Apartment deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete apartment" },
            { status: 500 }
        );
    }
}
