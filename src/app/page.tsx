import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

const properties = [
  {
    id: 1,
    title: "Apartment Serenity Ubud",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1974&auto=format&fit=crop",
    location: "Ubud, Bali",
    price: "Start from $250/night",
    slug: "apartment-serenity-ubud"
  },
  {
    id: 2,
    title: "Ocean Breeze Seminyak",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    location: "Seminyak, Bali",
    price: "Start from $350/night",
    slug: "ocean-breeze-seminyak"
  },
  {
    id: 3,
    title: "Jungle Retreat Canggu",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
    location: "Canggu, Bali",
    price: "Start from $180/night",
    slug: "jungle-retreat-canggu"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Featured Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Exclusive Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of luxury apartments and hotels, designed to provide you with an unforgettable Balinese experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                image={property.image}
                location={property.location}
                price={property.price}
                slug={property.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] md:h-[500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop"
              alt="Balinese Culture"
              className="w-full h-full object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 border-4 border-primary -z-10 hidden md:block" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Genuine Balinese Hospitality
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              At BaliRent, we believe that a true vacation is not just about the destination, but about the feeling of being at home. Our properties are curated to offer you the warmth and authenticity of Balinese culture, combined with modern luxuries.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Whether you are looking for a peaceful retreat in the jungle of Ubud or a vibrant beachfront apartment in Seminyak, we have the perfect sanctuary for you.
            </p>
            <button className="px-8 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors uppercase tracking-widest text-sm font-medium">
              Read Our Story
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
