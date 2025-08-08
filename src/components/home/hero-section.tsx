"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Globe, Shield, Eye } from 'lucide-react';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface HeroSectionProps {
  locale: Locale;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const features = [
    {
      icon: Globe,
      title: t(locale, 'home.features.global'),
      description: t(locale, 'home.features.globalDesc'),
    },
    {
      icon: Sparkles,
      title: t(locale, 'home.features.premium'),
      description: t(locale, 'home.features.premiumDesc'),
    },
    {
      icon: Shield,
      title: t(locale, 'home.features.secure'),
      description: t(locale, 'home.features.secureDesc'),
    },
    {
      icon: Eye,
      title: t(locale, 'home.features.transparent'),
      description: t(locale, 'home.features.transparentDesc'),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center mb-16">
          {/* Main Title */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {t(locale, 'home.title')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-slate-300 mb-4 font-light">
            {t(locale, 'home.subtitle')}
          </p>
          
          {/* Description */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            {t(locale, 'home.description')}
          </p>

          {/* CTA Button */}
          <Link href={`/${locale}/raffles`}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg group"
            >
              {t(locale, 'home.cta')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-yellow-500 mb-2">50K+</div>
            <div className="text-slate-300">Participantes Globais</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">$2M+</div>
            <div className="text-slate-300">Em Prêmios Entregues</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-red-500 mb-2">99.9%</div>
            <div className="text-slate-300">Taxa de Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
}