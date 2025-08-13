/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: process.env.SITE_LOCALE_DEFAULT || 'ar',
    locales: ['ar', 'en'],
  },
  images: {
    domains: [],
  },
};

export default nextConfig;
