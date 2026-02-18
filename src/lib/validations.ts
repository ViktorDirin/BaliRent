import { z } from 'zod';

export const apartmentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.preprocess((val) => {
        if (typeof val === 'string') return parseFloat(val);
        if (typeof val === 'number') return val;
        return 0; // or allow Zod to fail? Better to return NaN or something but 0 is safe-ish
    }, z.number().min(0, "Price must be positive")),

    location: z.string().default("Bali"),

    bedrooms: z.preprocess((val) => {
        if (typeof val === 'string') return parseInt(val, 10);
        if (typeof val === 'number') return val;
        return 1;
    }, z.number().min(1).default(1)),

    bathrooms: z.preprocess((val) => {
        if (typeof val === 'string') return parseInt(val, 10);
        if (typeof val === 'number') return val;
        return 1;
    }, z.number().min(1).default(1)),

    hasAirCon: z.boolean().default(false).optional(),
    hasWifi: z.boolean().default(true).optional(),
    hasKitchen: z.boolean().default(false).optional(),
    hasPool: z.boolean().default(false).optional(),
    hasWasher: z.boolean().default(false).optional(),
    city: z.string().default("Canggu").optional(),
});

export type ApartmentInput = z.infer<typeof apartmentSchema>;
