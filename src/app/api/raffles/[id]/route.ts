import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: raffle, error } = await supabase
      .from('raffles')
      .select(`
        *,
        raffle_numbers(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching raffle:', error);
      return NextResponse.json({ error: 'Raffle not found' }, { status: 404 });
    }

    // Calculate sold numbers
    const raffleWithStats = {
      ...raffle,
      soldNumbers: raffle.raffle_numbers?.[0]?.count || 0,
    };

    return NextResponse.json({ raffle: raffleWithStats });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}