import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  const hashedPassword = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fastfood.com' },
    update: {},
    create: {
      email: 'admin@fastfood.com',
      name: 'Administrador',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  const client = await prisma.user.upsert({
    where: { email: 'cliente@fastfood.com' },
    update: {},
    create: {
      email: 'cliente@fastfood.com',
      name: 'Cliente Teste',
      password: hashedPassword,
      role: UserRole.CLIENT,
    },
  })

  const tables = await Promise.all([
    prisma.table.upsert({
      where: { number: 1 },
      update: {},
      create: {
        number: 1,
        capacity: 2,
      },
    }),
    prisma.table.upsert({
      where: { number: 2 },
      update: {},
      create: {
        number: 2,
        capacity: 4,
      },
    }),
    prisma.table.upsert({
      where: { number: 3 },
      update: {},
      create: {
        number: 3,
        capacity: 6,
      },
    }),
    prisma.table.upsert({
      where: { number: 4 },
      update: {},
      create: {
        number: 4,
        capacity: 2,
      },
    }),
    prisma.table.upsert({
      where: { number: 5 },
      update: {},
      create: {
        number: 5,
        capacity: 4,
      },
    }),
  ])

  console.log('✅ Seed concluído!')
  console.log('👨‍💼 Admin criado:', admin.email)
  console.log('👤 Cliente criado:', client.email)
  console.log('🪑 Mesas criadas:', tables.length)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
