import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findUnique({
            where: {
                key: 'general',
            },
        });

        if (!settings) {
            return NextResponse.json({ value: JSON.stringify({}) }, { status: 200 });
        }

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const settings = await prisma.settings.upsert({
            where: {
                key: 'general',
            },
            update: {
                value: JSON.stringify(body),
            },
            create: {
                key: 'general',
                value: JSON.stringify(body),
            },
        });

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
