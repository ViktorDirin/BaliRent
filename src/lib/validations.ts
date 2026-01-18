import { z } from 'zod';

export const bookingSchema = z.object({
    apartmentId: z.string().uuid(),
    checkInDate: z.string().datetime().or(z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" })),
    checkOutDate: z.string().datetime().or(z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" })),
    guests: z.number().int().positive().or(z.string().regex(/^\d+$/).transform(Number)),
    totalPrice: z.string().or(z.number().transform(String)),
    customerName: z.string().min(1, "Name is required").optional(),
    customerEmail: z.string().email("Invalid email").optional(),
});

export const apartmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location is required"),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    images: z.string().refine((val) => {
        try {
            JSON.parse(val);
            return true;
        } catch {
            return false;
        }
    }, "Images must be a valid JSON string"),
});
