'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


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
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const bedrooms = parseInt(formData.get('bedrooms') as string || '1')

        // Handle images: extract all 'images' entries. 
        // If passed as a JSON string (from some clients), parse it. 
        // If passed as multiple fields (standard form), get them.
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

        const data = {
            title,
            description,
            pricePerNight: price,
            location: 'Bali',
            bedrooms: bedrooms || 1,
            images: JSON.stringify(imagesToSave),
            slug: (title || 'apartment').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
        }

        console.log("Saving to DB:", data)

        await prisma.apartment.create({
            data
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
