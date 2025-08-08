"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Mail, Lock, User, Phone } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { toast } from 'sonner';

interface LoginPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    whatsapp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        if (formData.email === 'admin@chanspaw.com' && formData.password === 'admin123') {
          localStorage.setItem('user', JSON.stringify({
            id: '1',
            email: formData.email,
            name: 'Administrador',
            role: 'admin'
          }));
          toast.success('Login realizado com sucesso!');
          router.push(`/${locale}/admin`);
        } else {
          // Regular user login
          localStorage.setItem('user', JSON.stringify({
            id: '2',
            email: formData.email,
            name: formData.name || 'Usuário',
            role: 'user'
          }));
          toast.success('Login realizado com sucesso!');
          router.push(`/${locale}`);
        }
      } else {
        // Register logic
        if (!formData.name || !formData.email || !formData.password) {
          toast.error('Preencha todos os campos obrigatórios');
          return;
        }
        
        localStorage.setItem('user', JSON.stringify({
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name,
          whatsapp: formData.whatsapp,
          role: 'user'
        }));
        
        toast.success('Cadastro realizado com sucesso!');
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Erro na autenticação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Acesse sua conta para participar dos sorteios'
              : 'Crie sua conta e comece a participar'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-600 hover:text-yellow-600 transition-colors"
            >
              {isLogin 
                ? 'Não tem conta? Criar uma agora'
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>
          
          {isLogin && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-slate-600 text-center">
                <strong>Admin:</strong> admin@chanspaw.com / admin123
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}