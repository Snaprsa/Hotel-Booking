'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <Link href={`/${locale}/rooms`} className="underline">
        {t('cta')}
      </Link>
    </main>
  );
}
