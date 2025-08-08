"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageSelector({ currentLocale, onLocaleChange }: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-100">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onLocaleChange(locale)}
            className={`cursor-pointer ${currentLocale === locale ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <Check className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}