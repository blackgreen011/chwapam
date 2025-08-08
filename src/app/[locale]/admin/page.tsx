"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, DollarSign, Trophy, Plus, Settings, BarChart3, LogOut } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { toast } from 'sonner';

interface AdminPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AdminPage({ params }: AdminPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRaffles: 5,
    activeRaffles: 3,
    totalUsers: 1250,
    totalRevenue: 45000,
    pendingPayments: 12
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push(`/${locale}/login`);
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta área.');
      router.push(`/${locale}`);
      return;
    }
    
    setUser(parsedUser);
  }, [locale, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
    router.push(`/${locale}`);
  };

  const createSampleRaffle = async () => {
    try {
      const sampleRaffle = {
        title: 'iPhone 15 Pro Max 256GB',
        description: 'iPhone 15 Pro Max 256GB Titânio Natural - Novo, lacrado com garantia Apple.',
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
        specifications: {
          'Modelo': 'iPhone 15 Pro Max',
          'Armazenamento': '256GB',
          'Cor': 'Titânio Natural',
          'Estado': 'Novo lacrado',
          'Garantia': '1 ano Apple'
        },
        market_value: 8999,
        price_per_number: 25,
        total_numbers: 1000,
        draw_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        translations: {
          pt: {
            title: 'iPhone 15 Pro Max 256GB',
            description: 'iPhone 15 Pro Max 256GB Titânio Natural - Novo, lacrado com garantia Apple.'
          },
          en: {
            title: 'iPhone 15 Pro Max 256GB',
            description: 'iPhone 15 Pro Max 256GB Natural Titanium - New, sealed with Apple warranty.'
          }
        }
      };

      const response = await fetch('/api/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleRaffle)
      });

      if (response.ok) {
        toast.success('Sorteio de exemplo criado com sucesso!');
        setStats(prev => ({ 
          ...prev, 
          totalRaffles: prev.totalRaffles + 1,
          activeRaffles: prev.activeRaffles + 1
        }));
      } else {
        toast.error('Erro ao criar sorteio de exemplo');
      }
    } catch (error) {
      console.error('Error creating sample raffle:', error);
      toast.error('Erro ao criar sorteio de exemplo');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-slate-300">Bem-vindo, {user.name}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sorteios</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRaffles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeRaffles} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Criar Sorteio</span>
              </CardTitle>
              <CardDescription>
                Adicione um novo sorteio à plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createSampleRaffle}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
              >
                Criar Sorteio de Exemplo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciar Usuários</span>
              </CardTitle>
              <CardDescription>
                Visualize e gerencie usuários da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Usuários
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
              </CardTitle>
              <CardDescription>
                Configure parâmetros da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Novo usuário cadastrado</p>
                  <p className="text-sm text-slate-600">João Silva - joao@email.com</p>
                </div>
                <Badge variant="secondary">Há 2 min</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Pagamento confirmado</p>
                  <p className="text-sm text-slate-600">Sorteio iPhone 15 - $125.00</p>
                </div>
                <Badge className="bg-green-500">Há 5 min</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Números reservados</p>
                  <p className="text-sm text-slate-600">5 números - Sorteio MacBook Pro</p>
                </div>
                <Badge variant="outline">Há 10 min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}