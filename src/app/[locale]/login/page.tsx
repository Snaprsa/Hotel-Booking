'use client';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const t = useTranslations('login');
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const onSubmit = handleSubmit(async (data) => {
    await signIn('credentials', { email: data.email, password: data.password });
  });
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4 max-w-sm mx-auto">
      <input {...register('email')} type="email" placeholder="Email" className="border p-2 w-full" />
      <input {...register('password')} type="password" placeholder="Password" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">{t('submit')}</button>
    </form>
  );
}
