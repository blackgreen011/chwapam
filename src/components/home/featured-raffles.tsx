"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, DollarSign } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { type Raffle } from '@/lib/supabase';

interface FeaturedRafflesProps {
  locale: Locale;
}

export function FeaturedRaffles({ locale }: FeaturedRafflesProps) {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRaffles();
  }, []);

  const fetchFeaturedRaffles = async () => {
    try {
      const response = await fetch('/api/raffles?status=active&limit=3');
      const data = await response.json();
      setRaffles(data.raffles || []);
    } catch (error) {
      console.error('Error fetching raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Sorteios em Destaque</h2>
            <p className="text-xl text-slate-600">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Sorteios em Destaque</h2>
          <p className="text-xl text-slate-600">
            Produtos premium com as melhores chances de ganhar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raffles.map((raffle) => {
            const translation = raffle.translations?.[locale] || {
              title: raffle.title,
              description: raffle.description
            };

            return (
              <Card key={raffle.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                  {raffle.images?.[0] ? (
                    <img 
                      src={raffle.images[0]} 
                      alt={translation.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-500 text-lg">{translation.title}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      {t(locale, `raffles.status.${raffle.status}`)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">
                    {translation.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                    {translation.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-slate-500">{t(locale, 'raffles.price')}:</span>
                      </div>
                      <span className="font-semibold text-green-600">${raffle.price_per_number}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-slate-500">{t(locale, 'raffles.soldNumbers')}:</span>
                      </div>
                      <span className="font-semibold">{raffle.soldNumbers || 0}/{raffle.total_numbers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-slate-500">{t(locale, 'raffles.drawDate')}:</span>
                      </div>
                      <span className="font-semibold">{new Date(raffle.draw_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Progresso</span>
                      <span className="font-semibold">
                        {Math.round(((raffle.soldNumbers || 0) / raffle.total_numbers) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((raffle.soldNumbers || 0) / raffle.total_numbers) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/${locale}/raffles/${raffle.id}`}>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 group-hover:scale-105">
                      {t(locale, 'product.selectNumbers')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${locale}/raffles`}>
            <Button variant="outline" size="lg" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white">
              Ver Todos os Sorteios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}