import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import ApartmentEditForm from "@/components/admin/ApartmentEditForm";
import { prisma } from "@/lib/prisma";

export default async function EditApartmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch apartment directly from the database
    const apartment = await prisma.apartment.findUnique({
        where: { id: id },
    });

    if (!apartment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Apartment Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The apartment you are looking for does not exist or has been deleted.
                </p>
                <Link
                    href="/admin/apartments"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Apartments
                </Link>
            </div>
        );
    }

    return <ApartmentEditForm initialData={apartment} />;
}
