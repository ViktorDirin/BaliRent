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

    // Generate robust slug
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const slugBase = (data.title || 'apartment').toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure slug is never empty
    const finalSlugBase = slugBase || 'apartment';
    const slug = `${finalSlugBase}-${timestamp}-${randomSuffix}`;

    // Handle JSON serialization for images
    let finalImages = "[]";
    if (Array.isArray(body.images)) {
      finalImages = JSON.stringify(body.images);
    } else if (typeof body.images === 'string') {
      // Ensure it's valid JSON if possible or just use it
      try {
        JSON.parse(body.images);
        finalImages = body.images;
      } catch (e) {
        // If not valid JSON, make it an array of one string 
        finalImages = JSON.stringify([body.images]);
      }
    }

    console.log("Creating apartment with slug:", slug);

    // Create apartment using available schema fields
    const apartment = await prisma.apartment.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location || "Bali",
        pricePerNight: data.price,
        images: finalImages,
        slug: slug,
        bedrooms: data.bedrooms,
        hasAirCon: data.hasAirCon ?? false,
        hasWifi: data.hasWifi ?? true,
        hasKitchen: data.hasKitchen ?? false,
        city: data.city || "Canggu",
        bathrooms: data.bathrooms,
        hasPool: data.hasPool ?? false,
        hasWasher: data.hasWasher ?? false,
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

  } catch (error: any) {
    console.error("DEBUG_POST_ERROR:", error);
    // return detailed error message
    return NextResponse.json(
      {
        error: 'Failed to create apartment',
        details: error.message || String(error),
        code: error.code // Prisma error code widely supports debugging
      },
      { status: 500 }
    );
  }
}
