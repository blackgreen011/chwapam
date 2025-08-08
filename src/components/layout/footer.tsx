"use client";

import Link from 'next/link';
import { Crown, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { t } from '@/lib/translations';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: t(locale, 'nav.about'), href: `/${locale}/about` },
      { name: t(locale, 'nav.contact'), href: `/${locale}/contact` },
      { name: 'Termos de Uso', href: `/${locale}/terms` },
      { name: 'Política de Privacidade', href: `/${locale}/privacy` },
    ],
    support: [
      { name: 'Central de Ajuda', href: `/${locale}/help` },
      { name: 'Como Funciona', href: `/${locale}/how-it-works` },
      { name: 'Pagamentos', href: `/${locale}/payments` },
      { name: 'Entrega de Prêmios', href: `/${locale}/delivery` },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'YouTube', href: '#', icon: Youtube },
    ],
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                CHANS PAW
              </span>
            </Link>
            <p className="text-slate-300 mb-6 max-w-md">
              {t(locale, 'home.description')}
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-slate-400 hover:text-yellow-500 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} CHANS PAW. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Pagamentos seguros por:</span>
            <div className="flex space-x-2">
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium">PIX</div>
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium">Stripe</div>
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium">Zelle</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}