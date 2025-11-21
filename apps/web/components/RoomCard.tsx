import Link from 'next/link';

interface RoomCardProps {
  room: any;
  nights: number;
  query: { startDate: Date; endDate: Date; adults: number };
}

export default function RoomCard({ room, nights, query }: RoomCardProps) {
  const rate = room.ratePlans[0];
  const totalBase = rate.baseMinor * nights;
  const totalTax = Math.round(totalBase * (rate.taxPercent / 100));
  const totalPrice = (totalBase + totalTax) / 100;

  return (
    <div className="bg-white shadow-lg group hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="h-64 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
          Room Image
        </div>
      </div>
      <div className="p-6">
        <div className="text-xs text-gold uppercase tracking-widest mb-2">{room.name}</div>
        <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors">
          {room.description}
        </h3>
        <div className="flex justify-between items-end mt-6 border-t pt-4">
          <div>
            <span className="block text-xs text-gray-400">Total for {nights} nights</span>
            <span className="text-lg font-bold">SAR {totalPrice.toLocaleString()}</span>
            <span className="text-xs text-gray-400 block">Includes taxes</span>
          </div>
          <Link
            href={`/book/${room.id}?start=${query.startDate.toISOString()}&end=${query.endDate.toISOString()}&rate=${rate.id}`}
            className="bg-dark text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-gold transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
