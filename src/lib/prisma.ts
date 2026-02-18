import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Check if we are in a build environment or missing credentials
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.warn('DATABASE_URL is not set. Using dummy connection for build.');
        return new PrismaClient({
            datasources: {
                db: {
                    url: 'postgresql://dummy:dummy@localhost:5432/dummy',
                },
            },
        });
    }

    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
        // Log queries in development for debugging, error/warn in production
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;