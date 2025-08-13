'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function BookPage({ params }: { params: { locale: string } }) {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState<any>(null);
  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomTypeId: data.roomTypeId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: Number(data.adults),
        children: Number(data.children),
        customer: { name: data.name, email: data.email, phone: data.phone },
        paymentMethod: 'PAY_AT_PROPERTY',
      }),
    });
    setResult(await res.json());
  });
  return (
    <div className="p-6 space-y-4">
      <form onSubmit={onSubmit} className="space-y-2">
        <input {...register('roomTypeId')} placeholder="RoomType ID" className="border p-2 w-full" />
        <input {...register('checkIn')} type="date" className="border p-2 w-full" />
        <input {...register('checkOut')} type="date" className="border p-2 w-full" />
        <input {...register('adults')} type="number" placeholder="Adults" className="border p-2 w-full" />
        <input {...register('children')} type="number" placeholder="Children" className="border p-2 w-full" />
        <input {...register('name')} placeholder="Name" className="border p-2 w-full" />
        <input {...register('email')} type="email" placeholder="Email" className="border p-2 w-full" />
        <input {...register('phone')} placeholder="Phone" className="border p-2 w-full" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Book</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
