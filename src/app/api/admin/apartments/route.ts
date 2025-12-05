import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, pricePerNight, beds, guests, images } = body;

    // Basic validation
    if (!title || !description || !pricePerNight || !beds || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apartment = await prisma.apartment.create({
      data: {
        title,
        description,
        pricePerNight,
        beds,
        guests,
        images: {
          create: images?.map((image: { url: string }) => ({
            url: image.url,
          })) || [],
        },
      },
    });

    return NextResponse.json(apartment, { status: 201 });
  } catch (error) {
    console.error('Error creating apartment:', error);
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    );
  }
}
