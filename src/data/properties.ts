export interface Property {
    id: string;
    title: string;
    location: string;
    description: string;
    pricePerNight: number;
    serviceFee: number;
    amenities: string[];
    images: string[];
}

export const MOCK_PROPERTIES: Property[] = [
    {
        id: 'serenity-ubud',
        title: 'Apartment Serenity Ubud',
        location: 'Ubud, Bali, Indonesia',
        description: 'Escape to this tranquil sanctuary nestled in the heart of Ubud. Surrounded by lush rice terraces and swaying palms, this apartment offers the perfect blend of modern luxury and traditional Balinese charm. Enjoy your morning coffee on the private balcony while listening to the sounds of nature, or take a short walk to the vibrant center of Ubud to explore local art markets and world-class restaurants. The space features a spacious open-plan living area, a fully equipped kitchen, and a master bedroom with an en-suite bathroom. High-speed WiFi and air conditioning ensure a comfortable and productive stay.',
        pricePerNight: 250,
        serviceFee: 50,
        amenities: [
            'Free WiFi',
            'Air Conditioning',
            'Swimming Pool',
            'Kitchen',
            'Private Balcony',
            'Smart TV'
        ],
        images: [
            'https://picsum.photos/id/237/700/500',
            'https://picsum.photos/id/238/700/500',
            'https://picsum.photos/id/239/700/500',
            'https://picsum.photos/id/240/700/500'
        ]
    },
    {
        id: 'ocean-breeze-seminyak',
        title: 'Ocean Breeze Seminyak',
        location: 'Seminyak, Bali, Indonesia',
        description: 'Experience the ultimate beachfront living at Ocean Breeze Seminyak. Just steps away from the famous Seminyak Beach, this stylish apartment offers breathtaking ocean views and easy access to the best beach clubs and nightlife in Bali. The modern interior is designed for comfort and relaxation, featuring floor-to-ceiling windows that flood the space with natural light. Relax by the infinity pool, enjoy a sunset cocktail on your terrace, or indulge in a spa treatment at the on-site wellness center.',
        pricePerNight: 350,
        serviceFee: 75,
        amenities: [
            'Ocean View',
            'Infinity Pool',
            'Gym',
            'Daily Housekeeping',
            'Security 24/7',
            'Parking'
        ],
        images: [
            'https://picsum.photos/id/10/700/500',
            'https://picsum.photos/id/11/700/500',
            'https://picsum.photos/id/12/700/500',
            'https://picsum.photos/id/13/700/500'
        ]
    }
];
