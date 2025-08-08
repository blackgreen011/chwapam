import { NextRequest, NextResponse } from 'next/server';
import { getRaffleNumbers, reserveNumbers } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numbersData = await getRaffleNumbers(id);
    return NextResponse.json(numbersData);
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

    const result = await reserveNumbers(id, numbers, userEmail, userName, userWhatsapp);
    
    return NextResponse.json({ 
      success: true, 
      reservedUntil: result.reservedUntil,
      numbers: result.data 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to reserve numbers' }, { status: 500 });
  }
}