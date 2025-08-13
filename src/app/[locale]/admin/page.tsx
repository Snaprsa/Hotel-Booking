import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${params.locale}/login`);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}
