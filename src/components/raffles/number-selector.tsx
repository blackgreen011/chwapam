"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shuffle, Zap, Heart, Clock, User, Mail, Phone } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { PaymentMethods } from '@/components/payment/payment-methods';
import { toast } from 'sonner';

interface NumberSelectorProps {
  locale: Locale;
  raffleId: string;
}

interface RaffleData {
  id: string;
  title: string;
  price_per_number: number;
  total_numbers: number;
  currency?: string;
}

export function NumberSelector({ locale, raffleId }: NumberSelectorProps) {
  const [raffle, setRaffle] = useState<RaffleData | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [soldNumbers, setSoldNumbers] = useState<number[]>([]);
  const [reservedNumbers, setReservedNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'select' | 'info' | 'payment'>('select');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // User info
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  // Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  useEffect(() => {
    fetchRaffleData();
    fetchNumbers();
  }, [raffleId]);

  useEffect(() => {
    if (selectedNumbers.length > 0 && timeLeft === 0) {
      setTimeLeft(15 * 60); // 15 minutes
    }
  }, [selectedNumbers.length]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setSelectedNumbers([]);
            setStep('select');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchRaffleData = async () => {
    try {
      const response = await fetch(`/api/raffles/${raffleId}`);
      if (response.ok) {
        const data = await response.json();
        setRaffle({
          id: data.raffle.id,
          title: data.raffle.title,
          price_per_number: data.raffle.price_per_number,
          total_numbers: data.raffle.total_numbers,
          currency: 'USD'
        });
      }
    } catch (error) {
      console.error('Error fetching raffle:', error);
    }
  };

  const fetchNumbers = async () => {
    try {
      const response = await fetch(`/api/raffles/${raffleId}/numbers`);
      if (response.ok) {
        const data = await response.json();
        setSoldNumbers(data.soldNumbers || []);
        setReservedNumbers(data.reservedNumbers || []);
      }
    } catch (error) {
      console.error('Error fetching numbers:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!raffle) return;
    
    const availableNumbers = Array.from({ length: raffle.total_numbers }, (_, i) => i + 1)
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
    setStep('select');
  };

  const proceedToInfo = () => {
    if (selectedNumbers.length === 0) {
      toast.error('Selecione pelo menos um número');
      return;
    }
    setStep('info');
  };

  const proceedToPayment = () => {
    if (!userInfo.name || !userInfo.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }

    try {
      // Reserve numbers first
      const reserveResponse = await fetch(`/api/raffles/${raffleId}/numbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numbers: selectedNumbers,
          userEmail: userInfo.email,
          userName: userInfo.name,
          userWhatsapp: userInfo.whatsapp
        })
      });

      if (!reserveResponse.ok) {
        throw new Error('Failed to reserve numbers');
      }

      // Process payment
      const paymentResponse = await fetch(`/api/payments/${selectedPaymentMethod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raffleId,
          numbers: selectedNumbers,
          amount: selectedNumbers.length * (raffle?.price_per_number || 0),
          currency: raffle?.currency || 'USD',
          userEmail: userInfo.email,
          userName: userInfo.name,
          userWhatsapp: userInfo.whatsapp
        })
      });

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        toast.success('Pagamento iniciado com sucesso!');
        
        // Handle different payment methods
        if (selectedPaymentMethod === 'pix') {
          // Show PIX instructions
          console.log('PIX payment data:', paymentData);
        } else if (selectedPaymentMethod === 'zelle') {
          // Show Zelle instructions
          console.log('Zelle payment data:', paymentData);
        } else if (selectedPaymentMethod === 'stripe') {
          // Redirect to Stripe
          console.log('Stripe payment data:', paymentData);
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro no pagamento. Tente novamente.');
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = raffle?.currency || 'USD';
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

  if (loading || !raffle) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-slate-200 rounded mb-4" />
          <div className="h-32 bg-slate-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (step === 'info') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{t(locale, 'checkout.personalInfo')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">{t(locale, 'checkout.name')} *</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <Label htmlFor="email">{t(locale, 'checkout.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp">{t(locale, 'checkout.whatsapp')}</Label>
            <Input
              id="whatsapp"
              value={userInfo.whatsapp}
              onChange={(e) => setUserInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="+55 11 99999-9999"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Números selecionados:</strong> {selectedNumbers.length}
            </p>
            <p className="text-lg font-bold text-green-600">
              Total: {formatCurrency(selectedNumbers.length * raffle.price_per_number)}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setStep('select')}>
              Voltar
            </Button>
            <Button onClick={proceedToPayment} className="flex-1">
              Continuar para Pagamento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(locale, 'checkout.paymentMethod')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethods
            locale={locale}
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={setSelectedPaymentMethod}
            amount={selectedNumbers.length * raffle.price_per_number}
            currency={raffle.currency || 'USD'}
          />
          
          <div className="flex space-x-3 mt-6">
            <Button variant="outline" onClick={() => setStep('info')}>
              Voltar
            </Button>
            <Button 
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
              disabled={!selectedPaymentMethod}
            >
              Finalizar Pagamento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <span>1</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(5)}
              className="flex items-center space-x-2"
            >
              <Shuffle className="h-4 w-4" />
              <span>5</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(10)}
              className="flex items-center space-x-2"
            >
              <Shuffle className="h-4 w-4" />
              <span>10</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => selectRandomNumbers(20)}
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>20</span>
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
                  {t(locale, 'product.total')}: {formatCurrency(selectedNumbers.length * raffle.price_per_number)}
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
                Limpar
              </Button>
              <Button 
                onClick={proceedToInfo}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 flex-1"
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
            {Array.from({ length: raffle.total_numbers }, (_, i) => i + 1).map(number => {
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