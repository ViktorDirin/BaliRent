
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with high-quality demo apartments...');

    // Clear existing data (optional, but good for demo)
    // For now, I'll just upsert or create new ones. Let's create new ones to ensure clean data for testing.
    // However, I should handle existing slugs to avoid conflicts if re-running.

    const apartments = [
        {
            slug: 'serene-ubud-jungle-villa',
            title: 'Serene Ubud Jungle Villa with Infinity Pool',
            description: 'Escape to the lush jungles of Ubud in this breathtaking private villa. Featuring an infinity pool overlooking the valley, open-air living spaces, and traditional Balinese architecture blended with modern luxury. Perfect for yoga enthusiasts and nature lovers seeking tranquility.',
            location: 'Ubud, Bali',
            city: 'Ubud',
            pricePerNight: 250,
            pricePerMonth: 6000,
            bedrooms: 3,
            bathrooms: 3,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 50,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2532&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2532&auto=format&fit=crop'
            ]),
            address: 'Jalan Raya Ubud No. 88, Gianyar'
        },
        {
            slug: 'modern-canggu-loft',
            title: 'Modern Industrial Loft in the Heart of Canggu',
            description: 'Stay in style at this chic industrial loft just minutes from Batu Bolong Beach. High ceilings, polished concrete floors, and floor-to-ceiling windows create a bright and airy atmosphere. Surrounded by the best cafes, coworking spaces, and nightlife Canggu has to offer.',
            location: 'Canggu, Bali',
            city: 'Canggu',
            pricePerNight: 120,
            pricePerMonth: 3000,
            bedrooms: 1,
            bathrooms: 1,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: false,
            cleaningFee: 30,
            checkInTime: '15:00',
            checkOutTime: '12:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2574&auto=format&fit=crop'
            ]),
            address: 'Jl. Pantai Batu Bolong No. 45, Canggu'
        },
        {
            slug: 'luxury-seminyak-pool-villa',
            title: 'Luxury 4-Bedroom Villa with Chef & Staff',
            description: 'Experience ultimate luxury in Seminyak. This expansive 4-bedroom villa comes fully staffed including a private chef. Designed for large groups or families, it features a massive pool, media room, and lush tropical gardens. Walking distance to Eat Street and Potato Head.',
            location: 'Seminyak, Bali',
            city: 'Seminyak',
            pricePerNight: 850,
            pricePerMonth: 20000,
            bedrooms: 4,
            bathrooms: 5,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 100,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop'
            ]),
            address: 'Jl. Kayu Aya No. 12, Seminyak'
        },
        {
            slug: 'ocean-view-uluwatu-cliff-house',
            title: 'Breathtaking Ocean View Cliff House',
            description: 'Perched on the cliffs of Uluwatu, this property offers panoramic Indian Ocean views from every room. Watch world-class surf breaks from your private balcony. Minimalist design focuses on the stunning natural surroundings. Includes access to a private beach below.',
            location: 'Uluwatu, Bali',
            city: 'Uluwatu',
            pricePerNight: 450,
            pricePerMonth: 12000,
            bedrooms: 2,
            bathrooms: 2,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 75,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2564&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2574&auto=format&fit=crop'
            ]),
            address: 'Jl. Pantai Suluban, Uluwatu'
        },
        {
            slug: 'cozy-bamboo-eco-cottage',
            title: 'Eco-Friendly Bamboo Cottage in Rice Fields',
            description: 'Reconnect with nature in this sustainable bamboo cottage situated in the middle of lush rice terraces. Open-air bathroom, organic garden, and fresh mountain breezes. A unique, rustic experience for those looking to unplug and unwind away from the crowds.',
            location: 'Tegallalang, Ubud',
            city: 'Ubud',
            pricePerNight: 90,
            pricePerMonth: 2200,
            bedrooms: 1,
            bathrooms: 1,
            hasAirCon: false,
            hasWifi: true,
            hasKitchen: false,
            hasPool: false,
            hasWasher: false,
            cleaningFee: 15,
            checkInTime: '13:00',
            checkOutTime: '10:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1558269984-dca176d75c24?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2670&auto=format&fit=crop'
            ]),
            address: 'Banjar Gagah, Tegallalang'
        },
        {
            slug: 'beachfront-nusa-dua-penthouse',
            title: 'Exclusive Beachfront Penthouse Suite',
            description: 'Wake up to the sound of waves in this 5-star beachfront penthouse in Nusa Dua. Marble bathrooms, premium linens, and a massive terrace with a jacuzzi. Access to resort amenities including gym, spa, and multiple restaurants. The definition of upscale tropical living.',
            location: 'Nusa Dua, Bali',
            city: 'Nusa Dua',
            pricePerNight: 1200,
            pricePerMonth: 30000,
            bedrooms: 3,
            bathrooms: 3,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 150,
            checkInTime: '15:00',
            checkOutTime: '12:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?q=80&w=2670&auto=format&fit=crop'
            ]),
            address: 'Kawasan ITDC Lot 1, Nusa Dua'
        },
        {
            slug: 'sanur-family-garden-home',
            title: 'Spacious Family Home with Private Garden',
            description: 'Perfect for families, this spacious home in quiet Sanur features a large enclosed garden and kid-friendly pool. Walking distance to the calm waters of Sanur Beach, international schools, and supermarkets. Fully equipped kitchen and comfortable living areas.',
            location: 'Sanur, Bali',
            city: 'Sanur',
            pricePerNight: 180,
            pricePerMonth: 4500,
            bedrooms: 3,
            bathrooms: 2,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 40,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1595524362625-27a387538c23?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560185127-6a6c42662c2f?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2670&auto=format&fit=crop'
            ]),
            address: 'Jl. Danau Tamblingan No. 101, Sanur'
        },
        {
            slug: 'romantic-seminyak-studio',
            title: 'Charming Studio Steps from the Beach',
            description: 'A cozy and romantic studio apartment perfect for couples. Located just 200m from Double Six Beach. Features a kitchenette, king-sized bed, and a quaint balcony for sunset drinks. Surrounded by Seminyak\'s famous vibrant dining and nightlife scene.',
            location: 'Seminyak, Bali',
            city: 'Seminyak',
            pricePerNight: 75,
            pricePerMonth: 1800,
            bedrooms: 1,
            bathrooms: 1,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: false,
            cleaningFee: 20,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2670&auto=format&fit=crop'
            ]),
            address: 'Jl. Arjuna No. 5, Seminyak'
        },
        {
            slug: 'jimbaran-hilltop-mansion',
            title: 'Spectacular Hilltop Mansion with Bay Views',
            description: 'Commanding views over Jimbaran Bay, this architectural masterpiece offers unmatched privacy and grandeur. 6 bedrooms, home cinema, wine cellar, and a 25-meter lap pool. Ideal for exclusive events or discerning travelers seeking the very best.',
            location: 'Jimbaran, Bali',
            city: 'Jimbaran',
            pricePerNight: 1500,
            pricePerMonth: 40000,
            bedrooms: 6,
            bathrooms: 7,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: true,
            hasWasher: true,
            cleaningFee: 200,
            checkInTime: '15:00',
            checkOutTime: '12:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2676&auto=format&fit=crop'
            ]),
            address: 'Jl. Bukit Permai, Jimbaran'
        },
        {
            slug: 'lovina-beach-bungalow',
            title: 'Quiet Beach Bungalow on North Coast',
            description: 'Escape the hustle and bustle of the south in this charming bungalow in Lovina. Direct access to a black sand beach, known for dolphin watching and calm waters. Simple, comfortable, and authentic Balinese hospitality. Great value for a peaceful retreat.',
            location: 'Lovina, Bali',
            city: 'Lovina',
            pricePerNight: 60,
            pricePerMonth: 1200,
            bedrooms: 2,
            bathrooms: 1,
            hasAirCon: true,
            hasWifi: true,
            hasKitchen: true,
            hasPool: false,
            hasWasher: false,
            cleaningFee: 15,
            checkInTime: '13:00',
            checkOutTime: '11:00',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1596178065887-1198b6148b2e?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2575&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?q=80&w=2564&auto=format&fit=crop'
            ]),
            address: 'Jl. Raya Lovina, Singaraja'
        }
    ];

    for (const apt of apartments) {
        await prisma.apartment.upsert({
            where: { slug: apt.slug },
            update: apt,
            create: apt,
        });
        console.log(`Upserted: ${apt.title}`);
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
