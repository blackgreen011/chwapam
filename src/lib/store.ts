import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale } from './i18n';

interface AppState {
  // User state
  user: {
    id?: string;
    email?: string;
    name?: string;
    whatsapp?: string;
    role?: 'user' | 'admin';
  } | null;
  
  // Cart state
  cart: {
    raffleId?: string;
    selectedNumbers: number[];
    totalAmount: number;
    currency: string;
  };
  
  // UI state
  locale: Locale;
  theme: 'light' | 'dark';
  
  // Actions
  setUser: (user: AppState['user']) => void;
  clearUser: () => void;
  setCart: (cart: Partial<AppState['cart']>) => void;
  clearCart: () => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      cart: {
        selectedNumbers: [],
        totalAmount: 0,
        currency: 'USD',
      },
      locale: 'pt',
      theme: 'light',
      
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setCart: (cart) => set((state) => ({ 
        cart: { ...state.cart, ...cart } 
      })),
      clearCart: () => set({ 
        cart: { selectedNumbers: [], totalAmount: 0, currency: 'USD' } 
      }),
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'chans-paw-store',
      partialize: (state) => ({
        user: state.user,
        locale: state.locale,
        theme: state.theme,
      }),
    }
  )
);