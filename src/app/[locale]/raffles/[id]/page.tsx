import { use } from 'react';
import { notFound } from 'next/navigation';
import { RaffleDetails } from '@/components/raffles/raffle-details';
import { NumberSelector } from '@/components/raffles/number-selector';
import { type Locale } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

interface RafflePageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

async function getRaffle(id: string) {
  const { data: raffle, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !raffle) {
    return null;
  }

  return raffle;
}

export default function RafflePage({ params }: RafflePageProps) {
  const { locale, id } = use(params);

  // For now, we'll fetch on client side to avoid build issues
  return (
    <div className="min-h-screen bg-slate-50">
      <RafflePageClient locale={locale} raffleId={id} />
    </div>
  );
}

function RafflePageClient({ locale, raffleId }: { locale: Locale; raffleId: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <RaffleDetails locale={locale} raffleId={raffleId} />
        </div>
        <div>
          <NumberSelector 
            locale={locale}
            raffleId={raffleId}
          />
        </div>
      </div>
    </div>
  );
}