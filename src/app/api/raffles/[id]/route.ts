import { NextRequest, NextResponse } from 'next/server';
import { getRaffleById } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raffle = await getRaffleById(id);
    return NextResponse.json({ raffle });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Raffle not found' }, { status: 404 });
  }
}