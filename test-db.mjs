import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.jiykhsvvhlxkrqfadrz:BaliRent2026@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

        },
    },
})

async function main() {
    console.log('🚀 Запуск прямой проверки...')
    try {
        await prisma.$connect()
        console.log('✅ УСПЕХ: Связь установлена!')
        const count = await prisma.apartment.count()
        console.log(`📊 Апартаментов в базе: ${count}`)
    } catch (e) {
        console.error('❌ ОШИБКА:')
        console.error(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()