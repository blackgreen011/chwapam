"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Zap, Heart, Clock } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface NumberSelectorProps {
  locale: Locale;
  totalNumbers: number;
  soldNumbers: number[];
  pricePerNumber: number;
  currency: string;
  onSelectionChange: (numbers: number[]) => void;
}

export function NumberSelector({ 
  locale, 
  totalNumbers, 
  soldNumbers, 
  pricePerNumber, 
  currency,
  onSelectionChange 
}: NumberSelectorProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [reservedNumbers, setReservedNumbers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Simulate reservation timer
  useEffect(() => {
    if (selectedNumbers.length > 0 && timeLeft === 0) {
      setTimeLeft(15 * 60); // 15 minutes in seconds
    }
  }, [selectedNumbers.length]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time expired, clear selection
            setSelectedNumbers([]);
            setReservedNumbers([]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    onSelectionChange(selectedNumbers);
  }, [selectedNumbers, onSelectionChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isNumberSold = (number: number) => soldNumbers.includes(number);
  const isNumberSelected = (number: number) => selectedNumbers.includes(number);
  const isNumberReserved = (number: number) => reservedNumbers.includes(number);

  const toggleNumber = (number: number) => {
    if (isNumberSold(number) || isNumberReserved(number)) return;

    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number].sort((a, b) => a - b);
      }
    });
  };

  const selectRandomNumbers = (count: number) => {
    const availableNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1)
      .filter(n => !isNumberSold(n) && !isNumberReserved(n) && !isNumberSelected(n));
    
    const randomNumbers = [];
    for (let i = 0; i < Math.min(count, availableNumbers.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      randomNumbers.push(availableNumbers.splice(randomIndex, 1)[0]);
    }
    
    setSelectedNumbers(prev => [...prev, ...randomNumbers].sort((a, b) => a - b));
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setTimeLeft(0);
  };

  const formatCurrency = (amount: number) => {
    const symbols = { USD: '$', EUR: '€', BRL: 'R$', HTG: 'G' };
    return `${symbols[currency as keyof typeof symbols] || '$'}${amount.toFixed(2)}`;
  };

  const getNumberStatus = (number: number) => {
    if (isNumberSold(number)) return 'sold';
    if (isNumberSelected(number)) return 'selected';
    if (isNumberReserved(number)) return 'reserved';
    return 'available';
  };

  const getNumberClass = (status: string) => {
    const baseClass = "w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer";
    
    switch (status) {
      case 'sold':
        return `${baseClass} bg-red-100 border-red-300 text-red-600 cursor-not-allowed opacity-50`;
      case 'selected':
        return `${baseClass} bg-yellow-500 border-yellow-600 text-white shadow-lg scale-105`;
      case 'reserved':
        return `${baseClass} bg-orange-100 border-orange-300 text-orange-600 cursor-not-allowed`;
      default:
        return `${baseClass} bg-white border-slate-300 text-slate-700 hover:border-yellow-500 hover:bg-yellow-50`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>{t(locale, 'product.quickPick')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(1)}
              className="flex items-center space-x-2"
            >
              <Shuffle className="h-4 w-4" />
              <span>1 número</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(5)}
              className="flex items-center space-x-2"
            >
              <Shuffle className="h-4 w-4" />
              <span>5 números</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(10)}
              className="flex items-center space-x-2"
            >
              <Shuffle className="h-4 w-4" />
              <span>10 números</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(20)}
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>20 números</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selection Info */}
      {selectedNumbers.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold">
                  {selectedNumbers.length} {t(locale, 'product.numbersSelected')}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {t(locale, 'product.total')}: {formatCurrency(selectedNumbers.length * pricePerNumber)}
                </p>
              </div>
              {timeLeft > 0 && (
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-lg font-mono font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <p className="text-xs text-orange-600">Tempo restante</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNumbers.map(number => (
                <Badge key={number} variant="secondary" className="bg-yellow-500 text-white">
                  {number.toString().padStart(4, '0')}
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={clearSelection}
                variant="outline"
                size="sm"
              >
                Limpar Seleção
              </Button>
              <Button 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                size="sm"
              >
                {t(locale, 'product.proceedToCheckout')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Numbers Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t(locale, 'product.selectNumbers')}</CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Selecionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span>Vendido</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2 max-h-96 overflow-y-auto">
            {Array.from({ length: totalNumbers }, (_, i) => i + 1).map(number => {
              const status = getNumberStatus(number);
              return (
                <div
                  key={number}
                  className={getNumberClass(status)}
                  onClick={() => toggleNumber(number)}
                >
                  {number.toString().padStart(4, '0')}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}