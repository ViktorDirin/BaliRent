import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apartmentSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("DEBUG_POST_BODY:", body);

    // Destructure and handle potential different naming from frontend
    const {
      title,
      description,
      location,
      price,
      pricePerNight,
      images,
      amenities,
      serviceFee
    } = body;

    // Handle price conversion (support both 'price' and 'pricePerNight' inputs)
    const priceValue = pricePerNight !== undefined ? pricePerNight : price;
    const finalPrice = parseFloat(String(priceValue || 0));
    const finalServiceFee = parseFloat(String(serviceFee || 0));

    // Handle JSON serialization for arrays/objects
    // If it's already a string, keep it. If it's an object/array, stringify it.
    const finalImages = typeof images === 'string' ? images : JSON.stringify(images || []);
    const finalAmenities = typeof amenities === 'string' ? amenities : JSON.stringify(amenities || []);

    // Generate slug
    const slugBase = (title || 'apartment').toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${Date.now()}`;

    const apartment = await prisma.apartment.create({
      data: {
        title: title || 'Untitled Apartment',
        description: description || '',
        location: location || 'Bali',
        pricePerNight: finalPrice,
        // Removed amenities and serviceFee if they break validation or schema, 
        // but assuming schema supports them if they are optional. 
        // Based on recent schema update, `images` is string?, `amenities` is NOT in updated schema provided in chat step 105.
        // Wait, step 105 schema shows `amenities` was removed? 
        // Let's check step 105 schema diff again.
        // Step 105 diff:
        // -  amenities     String?
        // -  serviceFee    Float     @default(0)
        // These were REMOVED.
        // So I must REMOVE them from the create call to avoid validation error.

        images: finalImages,
        slug: slug,
        bedrooms: 1, // Defaulting as requested
        hasAirCon: false,
        hasWifi: true,
        hasKitchen: false,
      },
    });

    return NextResponse.json({
      ...apartment,
      // parse back for response consistency if needed, though usually admin just wants ack
      images: apartment.images ? JSON.parse(apartment.images) : [],
      amenities: (apartment as any).amenities ? JSON.parse((apartment as any).amenities) : []
    }, { status: 201 });

  } catch (error) {
    console.error("DEBUG_POST_ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    );
  }
}
