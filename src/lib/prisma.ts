import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Prevent build failure if DATABASE_URL is missing
    const url = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;