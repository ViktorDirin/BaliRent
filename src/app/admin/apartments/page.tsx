import Link from "next/link";
import { Plus, Edit, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteApartmentButton from "@/components/admin/DeleteApartmentButton";

export const dynamic = 'force-dynamic';

export default async function ApartmentsPage() {
    // Fetch data directly from Supabase using the configured DATABASE_URL (Port 6543 with pgbouncer)
    const apartments = await prisma.apartment.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    }).catch((error) => {
        console.error("Error loading apartments directly from DB:", error);
        return [];
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Apartments</h1>
                    <p className="text-muted-foreground">Manage your property listings</p>
                </div>
                <Link
                    href="/admin/apartments/new"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Apartment
                </Link>
            </div>

            {apartments.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-neutral-200 text-center">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No apartments yet</h3>
                    <p className="text-muted-foreground mb-6">Get started by adding your first apartment</p>
                    <Link
                        href="/admin/apartments/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Apartment
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apartments.map((apartment: any) => (
                        <div key={apartment.id} className="bg-white text-slate-900 rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-neutral-200 relative">
                                {(() => {
                                    let images: string[] = [];
                                    try {
                                        const rawImages = apartment.images;
                                        if (Array.isArray(rawImages)) {
                                            images = rawImages;
                                        } else if (typeof rawImages === 'string') {
                                            if (rawImages.trim().startsWith('http')) {
                                                images = [rawImages];
                                            } else {
                                                const parsed = JSON.parse(rawImages);
                                                if (Array.isArray(parsed)) images = parsed;
                                            }
                                        }
                                    } catch (e) {
                                        images = [];
                                    }

                                    return images.length > 0 ? (
                                        <img
                                            src={images[0]}
                                            alt={apartment.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                            <Building2 className="h-12 w-12" />
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 truncate text-slate-900">{apartment.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4 truncate">{apartment.location}</p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/apartments/${apartment.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 text-slate-700 bg-white rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <DeleteApartmentButton apartmentId={apartment.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}