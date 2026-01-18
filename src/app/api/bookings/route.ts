import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { z } from 'zod';

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

        const booking = await prisma.booking.create({
            data: {
                apartmentId: validatedData.apartmentId,
                startDate: new Date(validatedData.checkInDate),
                endDate: new Date(validatedData.checkOutDate),
                guests: Number(validatedData.guests),
                totalPrice: String(validatedData.totalPrice),
                status: 'PENDING',
                customerName: validatedData.customerName,
                customerEmail: validatedData.customerEmail,
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
