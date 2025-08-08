import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface RafflesPageProps {
  params: { locale: Locale };
}

export default function RafflesPage({ params }: RafflesPageProps) {
  const { locale } = params;

  // Mock data for raffles
  const raffles = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      description: 'O smartphone mais avançado da Apple com câmera profissional',
      image: '/placeholder-iphone.jpg',
      marketValue: 1299,
      pricePerNumber: 5,
      totalNumbers: 1000,
      soldNumbers: 750,
      drawDate: '2024-02-15',
      status: 'active'
    },
    {
      id: 2,
      title: 'MacBook Pro M3 16"',
      description: 'Notebook profissional com chip M3 e 32GB de RAM',
      image: '/placeholder-macbook.jpg',
      marketValue: 2499,
      pricePerNumber: 10,
      totalNumbers: 500,
      soldNumbers: 320,
      drawDate: '2024-02-20',
      status: 'active'
    },
    {
      id: 3,
      title: 'Tesla Model 3',
      description: 'Carro elétrico premium com autopilot',
      image: '/placeholder-tesla.jpg',
      marketValue: 45000,
      pricePerNumber: 50,
      totalNumbers: 2000,
      soldNumbers: 1200,
      drawDate: '2024-03-01',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t(locale, 'raffles.title')}
          </h1>
          <p className="text-xl text-slate-300">
            Produtos premium com chances reais de ganhar
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option>Todas as categorias</option>
            <option>Eletrônicos</option>
            <option>Carros</option>
            <option>Casa</option>
          </select>
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option>Ordenar por</option>
            <option>Menor preço</option>
            <option>Maior preço</option>
            <option>Mais vendidos</option>
          </select>
        </div>

        {/* Raffles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-500 text-lg">{raffle.title}</span>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t(locale, `raffles.status.${raffle.status}`)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">
                  {raffle.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  {raffle.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t(locale, 'raffles.price')}:</span>
                    <span className="font-semibold text-green-600">${raffle.pricePerNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t(locale, 'product.marketValue')}:</span>
                    <span className="font-semibold">${raffle.marketValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t(locale, 'raffles.drawDate')}:</span>
                    <span className="font-semibold">{new Date(raffle.drawDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">{t(locale, 'raffles.soldNumbers')}</span>
                    <span className="font-semibold">{raffle.soldNumbers}/{raffle.totalNumbers}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(raffle.soldNumbers / raffle.totalNumbers) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105">
                  {t(locale, 'product.selectNumbers')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-lg font-semibold transition-all duration-300">
            Carregar Mais Sorteios
          </button>
        </div>
      </div>
    </div>
  );
}