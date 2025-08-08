import { use } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedRaffles } from '@/components/home/featured-raffles';
import { HowItWorks } from '@/components/home/how-it-works';
import { type Locale } from '@/lib/i18n';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = use(params);

  return (
    <div>
      <HeroSection locale={locale} />
      <FeaturedRaffles locale={locale} />
      <HowItWorks locale={locale} />
    </div>
  );
}