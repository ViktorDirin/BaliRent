import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/apartments - Get all apartments
export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(apartments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
    }
}

// POST /api/apartments - Create a new apartment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, location, price, slug, images } = body;

        const apartment = await prisma.apartment.create({
            data: {
                title,
                description,
                location,
                price,
                slug,
                images: JSON.stringify(images || []),
            },
        });

        return NextResponse.json(apartment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
    }
}
