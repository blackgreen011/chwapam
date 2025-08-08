import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { locales, type Locale, defaultLocale } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = params.locale || defaultLocale;

  const handleLocaleChange = (newLocale: Locale) => {
    // This will be handled by client-side navigation
    window.location.href = `/${newLocale}`;
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