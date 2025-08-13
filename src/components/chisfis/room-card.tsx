import Image from 'next/image';
import Link from 'next/link';

interface Props {
  id: string;
  slug: string;
  title: string;
  price: number;
  image?: string;
}

export function RoomCard({ id, slug, title, price, image }: Props) {
  return (
    <div className="border rounded overflow-hidden shadow-sm">
      {image && (
        <Image src={image} alt={title} width={400} height={200} className="w-full h-auto" />
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{price} SAR / night</p>
        <Link href={`/rooms/${slug}`} className="underline text-blue-600">
          View
        </Link>
      </div>
    </div>
  );
}
