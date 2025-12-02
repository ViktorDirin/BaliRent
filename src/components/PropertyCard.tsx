import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
    title: string;
    image: string;
    location: string;
    price?: string;
    slug: string;
}

export default function PropertyCard({ title, image, location, price, slug }: PropertyCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-none bg-card shadow-lg transition-all hover:shadow-xl">
            <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-6 bg-white dark:bg-neutral-900 border-t-4 border-primary">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{location}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-foreground">{title}</h3>
                {price && (
                    <p className="text-primary font-medium mb-4">{price}</p>
                )}
                <Link
                    href={`/apartments/${slug}`}
                    className="inline-block text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-1 hover:text-primary transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
