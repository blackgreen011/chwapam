import { HeroSection } from '@/components/home/hero-section';
import { type Locale } from '@/lib/i18n';

interface HomePageProps {
  params: { locale: Locale };
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  return (
    <div>
      <HeroSection locale={locale} />
      
      {/* Featured Raffles Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Sorteios em Destaque</h2>
            <p className="text-xl text-slate-600">
              Produtos premium com as melhores chances de ganhar
            </p>
          </div>
          
          {/* Placeholder for featured raffles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-slate-500 text-lg">Produto {i}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">iPhone 15 Pro Max</h3>
                  <p className="text-slate-600 mb-4">O smartphone mais avançado da Apple</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">$5.00</span>
                    <span className="text-sm text-slate-500">por número</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-slate-600">
              Simples, seguro e transparente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Escolha seu Sorteio', desc: 'Navegue pelos produtos premium disponíveis' },
              { step: '2', title: 'Selecione seus Números', desc: 'Escolha quantos números quiser para aumentar suas chances' },
              { step: '3', title: 'Aguarde o Sorteio', desc: 'Acompanhe ao vivo e torça para ser o grande ganhador' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}