"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, DollarSign, Trophy, Plus, Settings, BarChart3, LogOut } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AdminPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AdminPage({ params }: AdminPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalRaffles: 0,
    activeRaffles: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    
    if (profile && profile.role !== 'admin') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta área.');
      router.push(`/${locale}`);
      return;
    }

    if (profile) {
      fetchStats();
    }
  }, [user, profile, locale, router]);

  const fetchStats = async () => {
    try {
      // Buscar estatísticas reais do banco
      const [rafflesResult, usersResult, paymentsResult] = await Promise.all([
        supabase.from('raffles').select('status'),
        supabase.from('profiles').select('id'),
        supabase.from('payments').select('amount, payment_status')
      ]);

      const raffles = rafflesResult.data || [];
      const users = usersResult.data || [];
      const payments = paymentsResult.data || [];

      const totalRevenue = payments
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const pendingPayments = payments
        .filter(p => p.payment_status === 'pending').length;

      setStats({
        totalRaffles: raffles.length,
        activeRaffles: raffles.filter(r => r.status === 'active').length,
        totalUsers: users.length,
        totalRevenue,
        pendingPayments
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const createSampleRaffle = async () => {
    try {
      const sampleRaffle = {
        title: 'AirPods Pro 3ª Geração',
        description: 'AirPods Pro de 3ª geração com cancelamento ativo de ruído, áudio espacial e estojo de carregamento MagSafe.',
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'],
        specifications: {
          'Modelo': 'AirPods Pro 3ª Geração',
          'Cancelamento de Ruído': 'Ativo',
          'Bateria': 'Até 6h + 24h com estojo',
          'Conectividade': 'Bluetooth 5.3',
          'Estado': 'Novo lacrado',
          'Garantia': '1 ano Apple'
        },
        market_value: 1899,
        price_per_number: 10,
        total_numbers: 300,
        draw_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        translations: {
          pt: {
            title: 'AirPods Pro 3ª Geração',
            description: 'AirPods Pro de 3ª geração com cancelamento ativo de ruído.'
          },
          en: {
            title: 'AirPods Pro 3rd Generation',
            description: 'AirPods Pro 3rd generation with active noise cancellation.'
          }
        },
        featured: false,
        category: 'electronics'
      };

      const { data, error } = await supabase
        .from('raffles')
        .insert([sampleRaffle])
        .select()
        .single();

      if (error) {
        console.error('Error creating raffle:', error);
        toast.error('Erro ao criar sorteio: ' + error.message);
        return;
      }

      toast.success('Sorteio criado com sucesso!');
      await fetchStats();
    } catch (error) {
      console.error('Error creating sample raffle:', error);
      toast.error('Erro ao criar sorteio de exemplo');
    }
  };

  if (!profile || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando painel administrativo...</p>
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
                <p className="text-slate-300">Bem-vindo, {profile.name}</p>
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
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Pagamentos confirmados
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
                Aguardando confirmação
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
                Criar AirPods Pro
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
                Ver Usuários ({stats.totalUsers})
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
                Configurar Sistema
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>
              Informações sobre o funcionamento da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Banco de Dados</p>
                  <p className="text-sm text-green-600">Conectado e funcionando</p>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Autenticação</p>
                  <p className="text-sm text-green-600">Supabase Auth ativo</p>
                </div>
                <Badge className="bg-green-500">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-yellow-800">Pagamentos</p>
                  <p className="text-sm text-yellow-600">APIs de pagamento prontas para configuração</p>
                </div>
                <Badge className="bg-yellow-500">Configurar</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}