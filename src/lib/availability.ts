import { BookingStatus } from '@prisma/client';
import { prisma } from './prisma';

export async function getAvailableRoomTypes(checkIn: Date, checkOut: Date) {
  const roomTypes = await prisma.roomType.findMany({
    include: {
      units: { where: { isActive: true } },
      pricingRules: true,
    },
  });

  const results = [] as any[];
  for (const rt of roomTypes) {
    let availableUnits = 0;
    for (const unit of rt.units) {
      const overlappingBookings = await prisma.booking.count({
        where: {
          roomUnitId: unit.id,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
          OR: [
            {
              checkIn: { lt: checkOut },
              checkOut: { gt: checkIn },
            },
          ],
        },
      });
      const maintenance = await prisma.maintenanceBlock.count({
        where: {
          roomUnitId: unit.id,
          startDate: { lt: checkOut },
          endDate: { gt: checkIn },
        },
      });
      if (overlappingBookings === 0 && maintenance === 0) {
        availableUnits++;
      }
    }
    if (availableUnits > 0) {
      results.push({ ...rt, availableUnits });
    }
  }
  return results;
}
