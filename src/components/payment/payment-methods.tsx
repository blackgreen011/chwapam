"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, DollarSign, Shield, Check } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface PaymentMethodsProps {
  locale: Locale;
  selectedMethod?: string;
  onMethodSelect: (method: string) => void;
  amount: number;
  currency: string;
}

export function PaymentMethods({ 
  locale, 
  selectedMethod, 
  onMethodSelect, 
  amount, 
  currency 
}: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Cartão de crédito/débito internacional',
      icon: CreditCard,
      badge: 'Mais Popular',
      badgeColor: 'bg-blue-500',
      fees: '2.9% + $0.30',
      supported: ['USD', 'EUR', 'BRL'],
      features: ['Pagamento instantâneo', 'Proteção ao comprador', 'Aceita todos os cartões']
    },
    {
      id: 'pix',
      name: 'PIX',
      description: 'Pagamento instantâneo brasileiro',
      icon: Smartphone,
      badge: 'Sem Taxas',
      badgeColor: 'bg-green-500',
      fees: 'Gratuito',
      supported: ['BRL'],
      features: ['Transferência instantânea', 'Disponível 24/7', 'Sem taxas adicionais']
    },
    {
      id: 'zelle',
      name: 'Zelle',
      description: 'Transferência bancária nos EUA',
      icon: DollarSign,
      badge: 'Rápido',
      badgeColor: 'bg-purple-500',
      fees: 'Gratuito',
      supported: ['USD'],
      features: ['Transferência direta', 'Sem taxas', 'Processamento rápido']
    }
  ];

  const formatAmount = (amount: number, currency: string) => {
    const symbols = { USD: '$', EUR: '€', BRL: 'R$', HTG: 'G' };
    return `${symbols[currency as keyof typeof symbols] || '$'}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">{t(locale, 'checkout.paymentMethod')}</h3>
        <p className="text-slate-600">
          Total: <span className="text-2xl font-bold text-green-600">{formatAmount(amount, currency)}</span>
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isSupported = method.supported.includes(currency);

          return (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50' 
                  : 'hover:shadow-md border-slate-200'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isSupported && onMethodSelect(method.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-yellow-500 text-white' : 'bg-slate-100'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${method.badgeColor} text-white`}>
                      {method.badge}
                    </Badge>
                    {isSelected && (
                      <div className="p-1 bg-yellow-500 rounded-full">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Taxa:</span>
                    <span className="font-medium">{method.fees}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!isSupported && (
                    <div className="text-sm text-red-600 font-medium">
                      Não disponível para {currency}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="font-medium text-slate-800">Pagamento 100% Seguro</span>
        </div>
        <p className="text-sm text-slate-600">
          Todos os pagamentos são processados com criptografia SSL de 256 bits. 
          Seus dados financeiros estão completamente protegidos.
        </p>
      </div>
    </div>
  );
}