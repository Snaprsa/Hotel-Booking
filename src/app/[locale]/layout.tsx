import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export const metadata = {
  title: {
    default: 'Hotel Al Raha',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../public/locales/${params.locale}/common.json`)).default;
  } catch {
    notFound();
  }
  const dir = params.locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={params.locale} dir={dir}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
