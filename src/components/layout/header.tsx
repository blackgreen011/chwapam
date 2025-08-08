"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Menu, X, Crown, User, ShoppingBag } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Header({ locale, onLocaleChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t(locale, 'nav.home'), href: `/${locale}` },
    { name: t(locale, 'nav.raffles'), href: `/${locale}/raffles` },
    { name: t(locale, 'nav.myNumbers'), href: `/${locale}/my-numbers` },
    { name: t(locale, 'nav.about'), href: `/${locale}/about` },
    { name: t(locale, 'nav.contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-500" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              CHANS PAW
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
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
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4 mr-2" />
              {t(locale, 'nav.login')}
            </Button>

            <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t(locale, 'nav.raffles')}
            </Button>

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
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" size="sm" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  {t(locale, 'nav.login')}
                </Button>
                <Button size="sm" className="justify-start bg-gradient-to-r from-yellow-500 to-orange-500">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t(locale, 'nav.raffles')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}