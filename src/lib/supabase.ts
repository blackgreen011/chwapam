import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database Types
export interface Profile {
  id: string;
  email: string;
  name: string;
  whatsapp?: string;
  role: 'user' | 'admin' | 'moderator';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Raffle {
  id: string;
  title: string;
  description?: string;
  images: string[];
  specifications: Record<string, any>;
  market_value: number;
  price_per_number: number;
  total_numbers: number;
  draw_date: string;
  status: 'draft' | 'active' | 'paused' | 'ended' | 'drawn';
  winner_number?: number;
  winner_user_id?: string;
  created_by: string;
  translations: Record<string, any>;
  featured: boolean;
  category: string;
  created_at: string;
  updated_at: string;
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
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';
  payment_method?: 'stripe' | 'pix' | 'zelle' | 'paypal';
  payment_id?: string;
  reserved_until?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  raffle_id: string;
  user_id?: string;
  user_email: string;
  amount: number;
  currency: 'USD' | 'BRL' | 'EUR' | 'HTG';
  payment_method: 'stripe' | 'pix' | 'zelle' | 'paypal';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_intent_id?: string;
  external_payment_id?: string;
  numbers: number[];
  metadata: Record<string, any>;
  webhook_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Auth Helper Functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

export const isAdmin = async () => {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin';
};

export const isModerator = async () => {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin' || profile?.role === 'moderator';
};

// Database Helper Functions
export const getRaffles = async (status?: string, limit = 10, offset = 0) => {
  let query = supabase
    .from('raffles')
    .select(`
      *,
      raffle_numbers(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  
  if (error) throw error;

  return data?.map(raffle => ({
    ...raffle,
    soldNumbers: raffle.raffle_numbers?.[0]?.count || 0
  })) || [];
};

export const getRaffleById = async (id: string) => {
  const { data, error } = await supabase
    .from('raffles')
    .select(`
      *,
      raffle_numbers(count)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    soldNumbers: data.raffle_numbers?.[0]?.count || 0
  };
};

export const getRaffleNumbers = async (raffleId: string) => {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .select('number, payment_status, reserved_until')
    .eq('raffle_id', raffleId);

  if (error) throw error;

  const soldNumbers = data
    ?.filter(n => n.payment_status === 'paid')
    .map(n => n.number) || [];

  const reservedNumbers = data
    ?.filter(n => 
      n.payment_status === 'pending' && 
      n.reserved_until && 
      new Date(n.reserved_until) > new Date()
    )
    .map(n => n.number) || [];

  return { soldNumbers, reservedNumbers, totalSold: soldNumbers.length };
};

export const reserveNumbers = async (
  raffleId: string, 
  numbers: number[], 
  userEmail: string, 
  userName: string, 
  userWhatsapp?: string
) => {
  const user = await getCurrentUser();
  const reservedUntil = new Date();
  reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

  const numbersToInsert = numbers.map(number => ({
    raffle_id: raffleId,
    number,
    user_id: user?.id,
    user_email: userEmail,
    user_name: userName,
    user_whatsapp: userWhatsapp,
    payment_status: 'pending' as const,
    reserved_until: reservedUntil.toISOString(),
  }));

  const { data, error } = await supabase
    .from('raffle_numbers')
    .insert(numbersToInsert)
    .select();

  if (error) throw error;

  return { data, reservedUntil: reservedUntil.toISOString() };
};

export const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePaymentStatus = async (paymentId: string, status: Payment['payment_status'], metadata?: Record<string, any>) => {
  const updateData: any = { payment_status: status };
  if (metadata) {
    updateData.metadata = metadata;
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSettings = async (category?: string) => {
  let query = supabase.from('settings').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getSetting = async (key: string) => {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) throw error;
  return data?.value;
};