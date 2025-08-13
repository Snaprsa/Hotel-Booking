import { prisma } from '@/lib/prisma';
import { RoomCard } from '@/components/chisfis/room-card';

export default async function RoomsPage({ params }: { params: { locale: string } }) {
  const roomTypes = await prisma.roomType.findMany();
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2">
      {roomTypes.map((rt) => (
        <RoomCard
          key={rt.id}
          id={rt.id}
          slug={rt.slug}
          title={params.locale === 'ar' ? rt.titleAR : rt.titleEN}
          price={rt.baseNightlySar}
        />
      ))}
    </div>
  );
}
