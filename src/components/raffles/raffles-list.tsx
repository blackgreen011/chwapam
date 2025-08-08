"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock, Users, DollarSign } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { type Raffle } from '@/lib/supabase';

interface RafflesListProps {
  locale: Locale;
}

export function RafflesList({ locale }: RafflesListProps) {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterStatus, setFilterStatus] = useState('active');

  useEffect(() => {
    fetchRaffles();
  }, [filterStatus, sortBy]);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/raffles?status=${filterStatus}&limit=20`);
      const data = await response.json();
      setRaffles(data.raffles || []);
    } catch (error) {
      console.error('Error fetching raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRaffles = raffles.filter(raffle => {
    const translation = raffle.translations?.[locale] || {
      title: raffle.title,
      description: raffle.description
    };
    
    return translation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           translation.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-64 bg-slate-200" />
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 rounded mb-2" />
                <div className="h-4 bg-slate-200 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded" />
                  <div className="h-4 bg-slate-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar sorteios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="ended">Encerrados</SelectItem>
            <SelectItem value="drawn">Sorteados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Mais recentes</SelectItem>
            <SelectItem value="price_per_number">Menor preço</SelectItem>
            <SelectItem value="draw_date">Data do sorteio</SelectItem>
            <SelectItem value="market_value">Maior valor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          {filteredRaffles.length} sorteio(s) encontrado(s)
        </p>
      </div>

      {/* Raffles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRaffles.map((raffle) => {
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
                  <Badge className={`${
                    raffle.status === 'active' ? 'bg-green-500' :
                    raffle.status === 'ended' ? 'bg-red-500' :
                    raffle.status === 'drawn' ? 'bg-purple-500' :
                    'bg-gray-500'
                  } text-white`}>
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
                      <span className="text-slate-500">{t(locale, 'product.marketValue')}:</span>
                    </div>
                    <span className="font-semibold">${raffle.market_value.toLocaleString()}</span>
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
                    <span className="text-slate-500">{t(locale, 'raffles.soldNumbers')}</span>
                    <span className="font-semibold">{raffle.soldNumbers || 0}/{raffle.total_numbers}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((raffle.soldNumbers || 0) / raffle.total_numbers) * 100}%` }}
                    />
                  </div>
                </div>

                <Link href={`/${locale}/raffles/${raffle.id}`}>
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 group-hover:scale-105"
                    disabled={raffle.status !== 'active'}
                  >
                    {raffle.status === 'active' 
                      ? t(locale, 'product.selectNumbers')
                      : t(locale, `raffles.status.${raffle.status}`)
                    }
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      {filteredRaffles.length > 0 && (
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
            onClick={fetchRaffles}
          >
            Carregar Mais Sorteios
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredRaffles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Nenhum sorteio encontrado</h3>
          <p className="text-slate-600 mb-6">
            Tente ajustar os filtros ou pesquisar por outros termos
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('active');
              setSortBy('created_at');
            }}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}