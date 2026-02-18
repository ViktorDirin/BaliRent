import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: { apartment: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validatedData = bookingSchema.parse(body);

        const guestName = validatedData.customerName || validatedData.guestName || "Unknown Guest";
        const guestEmail = validatedData.customerEmail || validatedData.guestEmail || "unknown@example.com";

        const booking = await prisma.booking.create({
            data: {
                apartmentId: validatedData.apartmentId,
                startDate: new Date(validatedData.checkInDate),
                endDate: new Date(validatedData.checkOutDate),
                totalPrice: Number(validatedData.totalPrice),
                status: 'pending',
                guestName,
                guestEmail,
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
