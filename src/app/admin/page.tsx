import { createApartment } from '@/lib/actions'

export default function AdminPage() {
    return (
        <div className="p-8 bg-white text-black min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Add New Apartment</h1>
            <form action={createApartment} className="flex flex-col gap-4 max-w-md">
                <input name="title" placeholder="Title" className="border p-2" required />
                <textarea name="description" placeholder="Description" className="border p-2" required />
                <input name="price" type="number" placeholder="Price per night" className="border p-2" step="0.01" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
            </form>
        </div>
    )
}
