
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.apartment.count();
        console.log(`Apartment count: ${count}`);
    } catch (error) {
        console.error('Error counting apartments:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
