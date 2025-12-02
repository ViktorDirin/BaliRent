import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings - Get all bookings
export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: { apartment: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apartmentId, customerName, customerEmail, startDate, endDate, totalPrice, status } = body;

        const booking = await prisma.booking.create({
            data: {
                apartmentId,
                customerName,
                customerEmail,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                status: status || "pending",
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}
