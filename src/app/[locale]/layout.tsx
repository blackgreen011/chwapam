"use client";

import { use } from 'react';
import { Inter } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { type Locale } from '@/lib/i18n';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = use(params);

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <Header locale={locale} onLocaleChange={handleLocaleChange} />
          <main className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}