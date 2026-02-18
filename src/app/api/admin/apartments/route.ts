import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apartmentSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("DEBUG_POST_BODY:", body);

    // Map pricePerNight to price for validation if needed
    if (body.pricePerNight !== undefined && body.price === undefined) {
      body.price = body.pricePerNight;
    }

    const validation = apartmentSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error);
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate slug
    const slugBase = (data.title || 'apartment').toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${Date.now()}`;

    // Handle JSON serialization for images
    // If input is array, stringify. If string, leave as is.
    let finalImages = "[]";
    if (Array.isArray(body.images)) {
      finalImages = JSON.stringify(body.images);
    } else if (typeof body.images === 'string') {
      finalImages = body.images;
    }

    // Create apartment using available schema fields
    const apartment = await prisma.apartment.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        pricePerNight: data.price,
        images: finalImages,
        slug: slug,
        bedrooms: data.bedrooms,
        hasAirCon: data.hasAirCon,
        hasWifi: data.hasWifi,
        hasKitchen: data.hasKitchen,
        city: data.city,
        bathrooms: data.bathrooms,
        hasPool: data.hasPool,
        hasWasher: data.hasWasher,
        checkInTime: body.checkInTime || '14:00',
        checkOutTime: body.checkOutTime || '11:00',
        cleaningFee: body.cleaningFee ? parseFloat(String(body.cleaningFee)) : 0,
        address: body.address || null,
      },
    });

    return NextResponse.json({
      ...apartment,
      images: apartment.images ? JSON.parse(apartment.images) : [],
    }, { status: 201 });

  } catch (error) {
    console.error("DEBUG_POST_ERROR:", error);
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    );
  }
}
