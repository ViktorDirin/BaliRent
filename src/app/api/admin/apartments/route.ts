import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("DEBUG_POST_BODY:", body);

    const {
      title,
      description,
      location,
      price,
      pricePerNight,
      images,
      amenities,
      serviceFee,
      bedrooms,
      hasAirCon,
      hasWifi,
      hasKitchen,
      address,
      city,
      bathrooms,
      hasPool,
      hasWasher,
      checkInTime,
      checkOutTime,
      cleaningFee
    } = body;

    // Handle price conversion (support both 'price' and 'pricePerNight' inputs)
    const priceValue = pricePerNight !== undefined ? pricePerNight : price;
    const finalPrice = parseFloat(String(priceValue || 0));

    // Handle serviceFee safely (even if not currently used in create, ensures no crash)
    const finalServiceFee = parseFloat(String(serviceFee || 0));

    // Handle JSON serialization for images
    const finalImages = typeof images === 'string' ? images : JSON.stringify(images || []);

    // Generate slug
    const slugBase = (title || 'apartment').toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${Date.now()}`;

    // Create apartment using available schema fields
    const apartment = await prisma.apartment.create({
      data: {
        title: title || 'Untitled Apartment',
        description: description || '',
        location: location || 'Bali',
        pricePerNight: finalPrice,
        images: finalImages,
        slug: slug,
        // Map fields safely with defaults
        bedrooms: bedrooms ? parseInt(String(bedrooms)) : 1,
        hasAirCon: !!hasAirCon,
        hasWifi: hasWifi !== undefined ? !!hasWifi : true,
        hasKitchen: !!hasKitchen,
        address: address || null,
        city: city || 'Canggu',
        bathrooms: bathrooms ? parseInt(String(bathrooms)) : 1,
        hasPool: !!hasPool,
        hasWasher: !!hasWasher,
        checkInTime: checkInTime || '14:00',
        checkOutTime: checkOutTime || '11:00',
        cleaningFee: cleaningFee ? parseFloat(String(cleaningFee)) : 0,
      },
    });

    return NextResponse.json({
      ...apartment,
      // 1. & 2. Safe parsing for images and safe casting for amenities
      images: apartment.images ? JSON.parse(apartment.images) : [],
      amenities: (apartment as any).amenities ? JSON.parse((apartment as any).amenities) : []
    }, { status: 201 });

  } catch (error) {
    // 3. Generic error handling
    console.error("DEBUG_POST_ERROR:", error);
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    );
  }
}
