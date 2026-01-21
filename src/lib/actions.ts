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
        revalidatePath('/contact'); // Revalidate potential public pages using these settings
        revalidatePath('/');
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
