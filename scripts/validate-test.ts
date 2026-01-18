import { apartmentSchema, bookingSchema } from '../src/lib/validations';

console.log('Testing Validation Schemas...');

try {
    // 1. Test Valid Apartment
    console.log('Testing Valid Apartment...');
    apartmentSchema.parse({
        title: 'Luxury Villa',
        description: 'A beautiful place with a pool and ocean view',
        location: 'Bali, Indonesia',
        price: '150.00',
        images: JSON.stringify([{ url: 'http://example.com/img.jpg' }])
    });
    console.log('✅ Valid Apartment passed');

    // 2. Test Invalid Apartment (missing props)
    console.log('Testing Invalid Apartment (should fail)...');
    try {
        apartmentSchema.parse({
            title: 'Hi', // Too short
            description: 'Short',
            price: 'abc' // Invalid price
        });
        console.error('❌ Invalid Apartment SHOULD have failed but passed');
        process.exit(1);
    } catch (e) {
        console.log('✅ Invalid Apartment failed as expected');
    }

    // 3. Test Valid Booking
    console.log('Testing Valid Booking...');
    bookingSchema.parse({
        apartmentId: '123e4567-e89b-12d3-a456-426614174000',
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(Date.now() + 86400000).toISOString(),
        guests: 2,
        totalPrice: '300.00'
    });
    console.log('✅ Valid Booking passed');

    console.log('🎉 All schema tests passed!');

} catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
}
