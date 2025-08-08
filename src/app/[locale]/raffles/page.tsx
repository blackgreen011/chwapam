import { use } from 'react';
import { RafflesList } from '@/components/raffles/raffles-list';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface RafflesPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function RafflesPage({ params }: RafflesPageProps) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t(locale, 'raffles.title')}
          </h1>
          <p className="text-xl text-slate-300">
            Produtos premium com chances reais de ganhar
          </p>
        </div>
      </div>

      <RafflesList locale={locale} />
    </div>
  );
}