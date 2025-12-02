import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop")' }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-20">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                    Experience the Essence of <span className="text-primary">Bali</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                    Hotels and Private apartments in Bali with an embrace of genuine Balinese hospitality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/apartments"
                        className="px-8 py-4 bg-primary text-primary-foreground font-medium rounded-none hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm"
                    >
                        Explore Our Apartments
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-transparent text-white border border-white font-medium rounded-none hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
