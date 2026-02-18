import { createApartment } from '@/lib/actions'
import SeedButton from '@/components/SeedButton'

export const dynamic = 'force-dynamic';

export default function AdminPage() {
    return (
        <div className="p-8 bg-white text-black min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <SeedButton />
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Apartment</h2>
                <form action={createApartment} className="flex flex-col gap-4 max-w-md">
                    <input name="title" placeholder="Title" className="border p-2" required />
                    <textarea name="description" placeholder="Description" className="border p-2" required />
                    <input name="price" type="number" placeholder="Price per night" className="border p-2" step="0.01" required />
                    <input name="location" placeholder="Location (e.g., Ubud)" className="border p-2" />
                    <input name="bedrooms" type="number" placeholder="Bedrooms" className="border p-2" min="1" step="1" />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
                </form>
            </div>
        </div>
    )
}
