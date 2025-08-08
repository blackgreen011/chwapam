import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ataeueqpwdzghunwnvxa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YWV1ZXFwd2R6Z2h1bndudnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjQxNzgsImV4cCI6MjA3MDI0MDE3OH0.-oT0enfAxiUR-3uN2tfBKE7bPYAcPRN1lESrHElNxZU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Raffle {
  id: string;
  title: string;
  description: string;
  images: string[];
  specifications: Record<string, any>;
  market_value: number;
  price_per_number: number;
  total_numbers: number;
  draw_date: string;
  status: 'draft' | 'active' | 'paused' | 'ended' | 'drawn';
  winner_number?: number;
  winner_user_id?: string;
  created_at: string;
  updated_at: string;
  translations?: Record<string, {
    title: string;
    description: string;
    specifications?: Record<string, any>;
  }>;
  soldNumbers?: number;
}

export interface RaffleNumber {
  id: string;
  raffle_id: string;
  number: number;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  user_whatsapp?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: 'stripe' | 'pix' | 'zelle';
  payment_id?: string;
  reserved_until?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  whatsapp?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  raffle_id: string;
  user_id?: string;
  user_email: string;
  amount: number;
  currency: string;
  payment_method: 'stripe' | 'pix' | 'zelle';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_intent_id?: string;
  numbers: number[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}