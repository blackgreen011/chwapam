"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Menu, X, Crown, User, ShoppingBag, Sparkles, LogOut, Settings } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { useAuth } from '@/components/auth/auth-provider';

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Header({ locale, onLocaleChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: t(locale, 'nav.home'), href: `/${locale}` },
    { name: t(locale, 'nav.raffles'), href: `/${locale}/raffles` },
    { name: t(locale, 'nav.myNumbers'), href: `/${locale}/my-numbers` },
    { name: t(locale, 'nav.about'), href: `/${locale}/about` },
    { name: t(locale, 'nav.contact'), href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 h-3 w-3 text-yellow-400 animate-pulse delay-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-600 group-hover:to-orange-600 transition-all">
              CHANS PAW
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-yellow-600 ${
                  isActive(item.href) 
                    ? 'text-yellow-600 font-semibold' 
                    : 'text-slate-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector 
              currentLocale={locale} 
              onLocaleChange={onLocaleChange} 
            />
            
            {user && profile ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm text-slate-600">
                  Olá, {profile.name}
                </span>
                
                {(profile.role === 'admin' || profile.role === 'moderator') && (
                  <Link href={`/${locale}/admin`}>
                    <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-slate-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hidden sm:flex hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-slate-100">
                  <User className="h-4 w-4 mr-2" />
                  {t(locale, 'nav.login')}
                </Button>
              </Link>
            )}

            <Link href={`/${locale}/raffles`}>
              <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t(locale, 'nav.raffles')}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-yellow-600 px-2 py-1 rounded ${
                    isActive(item.href) 
                      ? 'text-yellow-600 bg-yellow-50 font-semibold' 
                      : 'text-slate-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {user && profile ? (
                  <>
                    <div className="px-2 py-1 text-sm text-slate-600">
                      Olá, {profile.name}
                    </div>
                    {(profile.role === 'admin' || profile.role === 'moderator') && (
                      <Link href={`/${locale}/admin`}>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link href={`/${locale}/login`}>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {t(locale, 'nav.login')}
                    </Button>
                  </Link>
                )}
                <Link href={`/${locale}/raffles`}>
                  <Button size="sm" className="justify-start bg-gradient-to-r from-yellow-500 to-orange-500">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t(locale, 'nav.raffles')}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}