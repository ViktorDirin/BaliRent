import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        const {
            apartmentId,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
            // Optional fields that might be passed
            customerName,
            customerEmail
        } = body;

        const booking = await prisma.booking.create({
            data: {
                apartmentId,
                startDate: new Date(checkInDate),
                endDate: new Date(checkOutDate),
                guests: Number(guests),
                totalPrice: String(totalPrice),
                status: 'PENDING',
                customerName,
                customerEmail,
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
