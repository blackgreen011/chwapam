"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Package, Users, Trophy, Clock } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { type Raffle } from '@/lib/supabase';

interface RaffleDetailsProps {
  locale: Locale;
  raffleId: string;
}

export function RaffleDetails({ locale, raffleId }: RaffleDetailsProps) {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRaffle();
  }, [raffleId]);

  const fetchRaffle = async () => {
    try {
      const response = await fetch(`/api/raffles/${raffleId}`);
      if (response.ok) {
        const data = await response.json();
        setRaffle(data.raffle);
      }
    } catch (error) {
      console.error('Error fetching raffle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded-t-lg" />
          <CardContent className="p-6">
            <div className="h-6 bg-slate-200 rounded mb-4" />
            <div className="h-4 bg-slate-200 rounded mb-2" />
            <div className="h-4 bg-slate-200 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!raffle) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Sorteio não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  const translation = raffle.translations?.[locale] || {
    title: raffle.title,
    description: raffle.description
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300">
          {raffle.images?.[0] ? (
            <img 
              src={raffle.images[0]} 
              alt={translation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-16 w-16 text-slate-400" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className={`${
              raffle.status === 'active' ? 'bg-green-500' :
              raffle.status === 'ended' ? 'bg-red-500' :
              'bg-gray-500'
            } text-white`}>
              {t(locale, `raffles.status.${raffle.status}`)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{translation.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-6">{translation.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-500">{t(locale, 'product.marketValue')}</p>
                <p className="font-semibold">${raffle.market_value.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-slate-500">{t(locale, 'raffles.price')}</p>
                <p className="font-semibold">${raffle.price_per_number}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">{t(locale, 'raffles.totalNumbers')}</p>
                <p className="font-semibold">{raffle.total_numbers.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-slate-500">{t(locale, 'raffles.drawDate')}</p>
                <p className="font-semibold">{new Date(raffle.draw_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      {raffle.specifications && Object.keys(raffle.specifications).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t(locale, 'product.specifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(raffle.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-600">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}