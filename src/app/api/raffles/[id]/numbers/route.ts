import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: numbers, error } = await supabase
      .from('raffle_numbers')
      .select('number, payment_status, reserved_until')
      .eq('raffle_id', id);

    if (error) {
      console.error('Error fetching numbers:', error);
      return NextResponse.json({ error: 'Failed to fetch numbers' }, { status: 500 });
    }

    const soldNumbers = numbers
      ?.filter(n => n.payment_status === 'paid')
      .map(n => n.number) || [];

    const reservedNumbers = numbers
      ?.filter(n => 
        n.payment_status === 'pending' && 
        n.reserved_until && 
        new Date(n.reserved_until) > new Date()
      )
      .map(n => n.number) || [];

    return NextResponse.json({ 
      soldNumbers, 
      reservedNumbers,
      totalSold: soldNumbers.length 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { numbers, userEmail, userName, userWhatsapp } = await request.json();

    // Reserve numbers for 15 minutes
    const reservedUntil = new Date();
    reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

    const numbersToInsert = numbers.map((number: number) => ({
      raffle_id: id,
      number,
      user_email: userEmail,
      user_name: userName,
      user_whatsapp: userWhatsapp,
      payment_status: 'pending',
      reserved_until: reservedUntil.toISOString(),
    }));

    const { data, error } = await supabase
      .from('raffle_numbers')
      .insert(numbersToInsert)
      .select();

    if (error) {
      console.error('Error reserving numbers:', error);
      return NextResponse.json({ error: 'Failed to reserve numbers' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      reservedUntil: reservedUntil.toISOString(),
      numbers: data 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}