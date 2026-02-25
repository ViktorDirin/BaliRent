'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { apartmentSchema } from '@/lib/validations'


export async function getSettings() {
    try {
        const settings = await prisma.settings.findMany();
        const settingsMap: Record<string, any> = {};

        settings.forEach(setting => {
            // Try to parse numbers or booleans if possible, otherwise use string
            if (setting.key === 'cleaningFee' || setting.key === 'taxRate') {
                settingsMap[setting.key] = parseFloat(setting.value);
            } else {
                settingsMap[setting.key] = setting.value;
            }
        });

        return settingsMap;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {};
    }
}

export async function updateSettings(settings: Record<string, any>) {
    try {
        const updates = Object.entries(settings).map(([key, value]) => {
            // Convert value to string for storage
            const stringValue = String(value);
            return prisma.settings.upsert({
                where: { key },
                update: { value: stringValue },
                create: { key, value: stringValue }
            });
        });

        await Promise.all(updates);
        revalidatePath('/admin/settings');
        revalidatePath('/contact');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        throw error;
    }
}



export async function createApartment(formData: FormData) {
    try {
        // Extract boolean values correctly from FormData checkboxes
        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            bedrooms: formData.get('bedrooms'),
            bathrooms: formData.get('bathrooms'),
            location: formData.get('location') || "Bali",
            city: formData.get('city') || "Canggu",
            // Checkbox value is 'on' if checked, null if not
            hasAirCon: formData.get('hasAirCon') === 'on',
            hasWifi: formData.get('hasWifi') === 'on',
            hasKitchen: formData.get('hasKitchen') === 'on',
            hasPool: formData.get('hasPool') === 'on',
            hasWasher: formData.get('hasWasher') === 'on',
        };

        const validation = apartmentSchema.safeParse(rawData);

        if (!validation.success) {
            console.error("Validation failed:", validation.error.flatten());
            throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
        }

        const data = validation.data;

        // Handle images: extract all 'images' entries. 
        const rawImages = formData.getAll('images');
        let imagesToSave: string[] = [];

        // Check if the first element is a JSON string of an array
        if (rawImages.length > 0 && typeof rawImages[0] === 'string' && rawImages[0].startsWith('[')) {
            try {
                imagesToSave = JSON.parse(rawImages[0] as string);
            } catch (e) {
                imagesToSave = rawImages as string[];
            }
        } else {
            imagesToSave = rawImages as string[];
        }

        // Generate robust slug
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        const slugBase = (data.title || 'apartment').toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const finalSlugBase = slugBase || 'apartment';
        const slug = `${finalSlugBase}-${timestamp}-${randomSuffix}`;

        console.log("Generated slug:", slug);

        const apartmentData = {
            title: data.title,
            description: data.description,
            pricePerNight: data.price,
            location: data.location || 'Bali',
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            city: data.city || 'Canggu',
            hasAirCon: data.hasAirCon ?? false,
            hasWifi: data.hasWifi ?? true,
            hasKitchen: data.hasKitchen ?? false,
            hasPool: data.hasPool ?? false,
            hasWasher: data.hasWasher ?? false,
            images: JSON.stringify(imagesToSave),
            slug: slug
        };

        console.log("Saving to DB:", apartmentData)

        await prisma.apartment.create({
            data: apartmentData
        })
        revalidatePath('/admin')
    } catch (error) {
        console.error("Prisma Error in createApartment:", error)
        throw error
    }
}

export async function createBooking(data: {
    apartmentId: string;
    startDate: Date;
    endDate: Date;
    guestName: string;
    guestEmail: string;
    totalPrice: number;
}) {
    try {
        await prisma.booking.create({
            data: {
                apartmentId: data.apartmentId,
                startDate: data.startDate,
                endDate: data.endDate,
                guestName: data.guestName,
                guestEmail: data.guestEmail,
                totalPrice: data.totalPrice,
                status: 'pending'
            }
        });
        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error("Error creating booking:", error);
    }
}

export async function updateBookingStatus(id: string, status: string) {
    try {
        await prisma.booking.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error("Error updating booking status:", error);
    }
}

export async function seedApartments() {
    try {
        const apartments = [
            {
                title: "Villa Sawah Retreat",
                description: "Escape to the tranquil rice fields of Ubud in this stunning open-air villa. Featuring a private infinity pool overlooking the lush greenery, this 3-bedroom retreat offers the perfect blend of luxury and nature. Enjoy daily yoga sessions on the deck and authentic Balinese cuisine prepared by our in-house chef.",
                pricePerNight: 250,
                location: "Ubud",
                bedrooms: 3,
                bathrooms: 3,
                amenities: { hasWifi: true, hasPool: true, hasAirCon: true, hasKitchen: true, hasWasher: true },
                images: ["https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                title: "Oceanfront Cliffside Villa",
                description: "Perched on the dramatic cliffs of Uluwatu, this modern architectural masterpiece offers breathtaking panoramic ocean views. Watch the sunset from your private pool or walk down to the pristine white sand beach below. Includes a state-of-the-art media room and a full staff to cater to your every need.",
                pricePerNight: 550,
                location: "Uluwatu",
                bedrooms: 4,
                bathrooms: 4,
                amenities: { hasWifi: true, hasPool: true, hasAirCon: true, hasKitchen: true, hasWasher: true },
                images: ["https://images.unsplash.com/photo-1499955085172-a104c9463ece?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                title: "Minimalist Loft Canggu",
                description: "Stay in the heart of the action in this stylish, industrial-chic loft in Canggu. Just steps away from the best cafes, beach clubs, and surf spots. The loft features high ceilings, polished concrete floors, and a rooftop terrace perfect for evening cocktails.",
                pricePerNight: 120,
                location: "Canggu",
                bedrooms: 1,
                bathrooms: 1,
                amenities: { hasWifi: true, hasPool: false, hasAirCon: true, hasKitchen: true, hasWasher: false },
                images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"]
            },
            {
                title: "Tropical Garden Oasis",
                description: "Hidden away in a quiet lane in Seminyak, this charming villa is surrounded by a lush tropical garden. The layout centers around a sparkling pool, creating a private sanctuary. Each bedroom has an en-suite outdoor bathroom for a true island experience.",
                pricePerNight: 180,
                location: "Seminyak",
                bedrooms: 2,
                bathrooms: 2,
                amenities: { hasWifi: true, hasPool: true, hasAirCon: true, hasKitchen: true, hasWasher: true },
                images: ["https://images.unsplash.com/photo-1576013551627-5cc20b3285f9?q=80&w=2064&auto=format&fit=crop"]
            },
            {
                title: "Luxury Beachfront Penthouse",
                description: "Experience the height of luxury in this sprawling penthouse overlooking Nusa Dua beach. Featuring direct elevator access, a private jacuzzi on the balcony, and five-star resort amenities including gym access and concierge service.",
                pricePerNight: 400,
                location: "Nusa Dua",
                bedrooms: 2,
                bathrooms: 2,
                amenities: { hasWifi: true, hasPool: true, hasAirCon: true, hasKitchen: true, hasWasher: true },
                images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2073&auto=format&fit=crop"]
            }
        ];

        for (const apt of apartments) {
            const slug = apt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + Math.floor(Math.random() * 1000);

            await prisma.apartment.create({
                data: {
                    title: apt.title,
                    description: apt.description,
                    pricePerNight: apt.pricePerNight,
                    location: apt.location || "Bali",
                    bedrooms: apt.bedrooms,
                    bathrooms: apt.bathrooms,
                    images: JSON.stringify(apt.images),
                    slug: slug,
                    city: apt.location,
                    ...apt.amenities
                }
            });
        }

        revalidatePath('/our-apartments');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error seeding apartments:", error);
        throw error;
    }
}

export async function getAvailableApartments(startDate: Date, endDate: Date, guests: number = 0) {
    try {
        // Strict interval overlap — allows same-day turnover:
        //   booking BLOCKS the search window ONLY IF:
        //   bookingStart < selectedEnd  AND  bookingEnd > selectedStart
        // Only 'confirmed' and 'pending' bookings block; 'cancelled' does not.
        const conflictingBookings = await prisma.booking.findMany({
            where: {
                status: { in: ['confirmed', 'pending'] },
                startDate: { lt: endDate },
                endDate: { gt: startDate },
            },
            select: { apartmentId: true },
        });

        const bookedApartmentIds = conflictingBookings.map(b => b.apartmentId);

        const apartments = await prisma.apartment.findMany({
            where: {
                id: { notIn: bookedApartmentIds },
                bedrooms: {
                    gte: guests > 0 ? Math.ceil(guests / 2) : 0,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return apartments;

    } catch (error) {
        console.error("Error fetching available apartments:", error);
        return [];
    }
}

export async function getBookedDates(apartmentId: string) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                apartmentId,
                status: 'confirmed',
                endDate: {
                    gte: new Date()
                }
            },
            select: {
                startDate: true,
                endDate: true
            }
        });

        const bookedDates: Date[] = [];

        bookings.forEach(booking => {
            const currentDate = new Date(booking.startDate);
            const end = new Date(booking.endDate);

            while (currentDate <= end) {
                bookedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return bookedDates;
    } catch (error) {
        console.error("Error fetching booked dates:", error);
        return [];
    }
}

export async function sendMessage(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        // Server-side validation
        if (!data.name.trim()) return { success: false, error: "Name is required." };
        if (!data.email.trim()) return { success: false, error: "Email is required." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            return { success: false, error: "Invalid email address." };
        if (!data.phone.trim()) return { success: false, error: "Phone number is required." };
        if (!data.message.trim()) return { success: false, error: "Message is required." };

        const record = await prisma.contactMessage.create({
            data: {
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                phone: data.phone.trim(),
                message: data.message.trim(),
            },
        });

        console.log("📩 New contact message received:", {
            id: record.id,
            name: record.name,
            email: record.email,
            phone: record.phone,
            message: record.message,
            at: record.createdAt.toISOString(),
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error saving contact message:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }
}
