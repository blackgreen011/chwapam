"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Search, MousePointer, Clock, Trophy } from 'lucide-react';
import { type Locale } from '@/lib/i18n';

interface HowItWorksProps {
  locale: Locale;
}

export function HowItWorks({ locale }: HowItWorksProps) {
  const steps = [
    {
      step: '1',
      icon: Search,
      title: 'Escolha seu Sorteio',
      description: 'Navegue pelos produtos premium disponíveis e encontre o que mais te interessa',
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '2',
      icon: MousePointer,
      title: 'Selecione seus Números',
      description: 'Escolha quantos números quiser para aumentar suas chances de ganhar',
      color: 'from-green-500 to-green-600'
    },
    {
      step: '3',
      icon: Clock,
      title: 'Realize o Pagamento',
      description: 'Pague de forma seg ura com PIX, Stripe ou Zelle em poucos cliques',
      color: 'from-orange-500 to-orange-600'
    },
    {
      step: '4',
      icon: Trophy,
      title: 'Aguarde o Sorteio',
      description: 'Acompanhe ao vivo e torça para ser o grande ganhador do prêmio',
      color: 'from-purple-500 to-purple-600'
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Participar é simples, seguro e transparente. Siga estes passos e concorra a prêmios incríveis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-slate-400 mx-auto group-hover:text-slate-600 transition-colors" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-yellow-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              🎯 Transparência Total
            </h3>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Todos os sorteios são realizados ao vivo com transmissão online. 
              Você pode acompanhar cada etapa do processo e ter certeza da legitimidade do resultado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}