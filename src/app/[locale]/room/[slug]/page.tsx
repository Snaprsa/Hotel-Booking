import { prisma } from '@/lib/prisma';

export default async function RoomDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const roomType = await prisma.roomType.findUnique({ where: { slug: params.slug } });
  if (!roomType) return <div>Not found</div>;
  const title = params.locale === 'ar' ? roomType.titleAR : roomType.titleEN;
  const desc = params.locale === 'ar' ? roomType.descAR : roomType.descEN;
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{desc}</p>
      <p>{roomType.baseNightlySar} SAR / night</p>
    </div>
  );
}
