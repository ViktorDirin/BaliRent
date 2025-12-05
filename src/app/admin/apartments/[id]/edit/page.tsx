import { notFound } from "next/navigation";
import ApartmentEditForm from "@/components/admin/ApartmentEditForm";

async function getApartment(id: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/apartments/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching apartment:", error);
        return null;
    }
}

export default async function EditApartmentPage({ params }: { params: { id: string } }) {
    const apartment = await getApartment(params.id);

    if (!apartment) {
        notFound();
    }

    return <ApartmentEditForm initialData={apartment} />;
}
