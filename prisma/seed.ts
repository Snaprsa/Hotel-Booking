import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin#12345', 10);
  await prisma.user.upsert({
    where: { email: 'admin@alraha.local' },
    update: {},
    create: {
      email: 'admin@alraha.local',
      name: 'Admin',
      role: Role.ADMIN,
      passwordHash: password,
    },
  });

  const roomTypes = [
    { slug: 'studio', titleAR: 'استوديو', titleEN: 'Studio', descAR: 'غرفة استوديو', descEN: 'Studio room', capacityAdults: 2, capacityChildren: 0, baseNightlySar: 180, baseMonthlySar: 4500 },
    { slug: '1br-kitchen', titleAR: 'غرفة وصالة', titleEN: '1BR + Kitchen', descAR: 'غرفة وصالة مع مطبخ', descEN: '1 bedroom with kitchen', capacityAdults: 3, capacityChildren: 0, baseNightlySar: 250, baseMonthlySar: 6500 },
    { slug: '1br-2bath-kitchen', titleAR: 'غرفة وصالة وحمامين', titleEN: '1BR + 2 Bath + Kitchen', descAR: 'غرفة وصالة وحمامين ومطبخ', descEN: '1 bedroom, two bathrooms and kitchen', capacityAdults: 4, capacityChildren: 0, baseNightlySar: 320, baseMonthlySar: 8000 },
    { slug: '2br-2bath-kitchen', titleAR: 'غرفتين وصالة', titleEN: '2BR + 2 Bath + Kitchen', descAR: 'غرفتين وصالة وحمامين ومطبخ', descEN: '2 bedrooms, two bathrooms and kitchen', capacityAdults: 6, capacityChildren: 0, baseNightlySar: 450, baseMonthlySar: 11000 },
  ];

  for (const rt of roomTypes) {
    await prisma.roomType.upsert({
      where: { slug: rt.slug },
      update: {},
      create: {
        slug: rt.slug,
        titleAR: rt.titleAR,
        titleEN: rt.titleEN,
        descAR: rt.descAR,
        descEN: rt.descEN,
        capacityAdults: rt.capacityAdults,
        capacityChildren: rt.capacityChildren,
        baseNightlySar: rt.baseNightlySar,
        baseMonthlySar: rt.baseMonthlySar,
        amenities: [],
        images: [],
      },
    });
  }

  const studio = await prisma.roomType.findUnique({ where: { slug: 'studio' } });
  if (studio) {
    await prisma.roomUnit.createMany({
      data: [
        { code: 'ST-101', roomTypeId: studio.id },
        { code: 'ST-102', roomTypeId: studio.id },
        { code: 'ST-103', roomTypeId: studio.id },
      ],
      skipDuplicates: true,
    });
  }

  // Example seasonal pricing rule (Ramadan placeholder)
  const start = new Date(new Date().getFullYear(), 2, 1);
  const end = new Date(new Date().getFullYear(), 2, 30);
  await prisma.pricingRule.create({
    data: {
      title: 'Ramadan',
      startDate: start,
      endDate: end,
      mode: 'PERCENT',
      value: -10,
      roomTypeId: studio?.id,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
