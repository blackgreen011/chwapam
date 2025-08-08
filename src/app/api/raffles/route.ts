import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: raffles, error } = await supabase
      .from('raffles')
      .select(`
        *,
        raffle_numbers(count)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching raffles:', error);
      return NextResponse.json({ error: 'Failed to fetch raffles' }, { status: 500 });
    }

    // Calculate sold numbers for each raffle
    const rafflesWithStats = raffles?.map(raffle => ({
      ...raffle,
      soldNumbers: raffle.raffle_numbers?.[0]?.count || 0,
    })) || [];

    return NextResponse.json({ raffles: rafflesWithStats });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data: raffle, error } = await supabase
      .from('raffles')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating raffle:', error);
      return NextResponse.json({ error: 'Failed to create raffle' }, { status: 500 });
    }

    return NextResponse.json({ raffle }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}