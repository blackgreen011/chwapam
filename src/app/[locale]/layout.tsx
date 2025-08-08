"use client";

import { Inter } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { type Locale, getLocaleFromUrl } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale;

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the current locale in the pathname with the new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header locale={locale} onLocaleChange={handleLocaleChange} />
          <main className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}