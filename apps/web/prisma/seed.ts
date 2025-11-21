import { PrismaClient } from '@prisma/client';
import { startOfDay, addDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Room
  const room = await prisma.room.upsert({
    where: { code: 'KING1' },
    update: {},
    create: {
      code: 'KING1',
      name: 'Deluxe King Room',
      description: 'A spacious 45sqm room with Red Sea views and elegant furnishings.',
      capacity: 2,
      active: true,
    },
  });

  // 2. Create Rate Plan
  await prisma.ratePlan.upsert({
    where: { code: 'STD_FLEX' },
    update: {},
    create: {
      code: 'STD_FLEX',
      roomId: room.id,
      name: 'Standard Flexible',
      baseMinor: 65000, // 650.00 SAR
      taxPercent: 15.0,
      refundable: true,
      cancelWindowHours: 24,
    },
  });

  // 3. Seed Inventory for 180 days
  const today = startOfDay(new Date());
  const inventoryData = [];

  for (let i = 0; i < 180; i++) {
    const date = addDays(today, i);
    inventoryData.push({
      roomId: room.id,
      date: date,
      total: 5,
      reserved: 0,
    });
  }

  // Batch insert using upsert for safety
  for (const inv of inventoryData) {
    await prisma.inventory.upsert({
      where: {
        roomId_date: {
          roomId: inv.roomId,
          date: inv.date,
        }
      },
      update: {},
      create: inv,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
